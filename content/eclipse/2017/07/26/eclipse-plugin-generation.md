+++
title = 'Eclipse Plugin Generation'
date = 2017-07-26 17:53:00+02:00
url = '/eclipse/2017/07/26/eclipse-plugin-generation.html'
+++
I am currently working with eclipse projects. Lots of eclipse projects. So much that I want to generate eclipse projects using java code (I hope to write another article of the why of this soon).

Surprisingly this task is not really complicated but requires an awful lot of
code to work.

So once I made it work if felt the need to share it as I did not found much documentation.

The following code is just an simplification of [org.eclipse.pde.internal.ui.wizards.plugin.NewProjectCreationOperation](https://github.com/eclipse/eclipse.pde.ui/blob/master/ui/org.eclipse.pde.ui/src/org/eclipse/pde/internal/ui/wizards/plugin/NewProjectCreationOperation.java) from the Plugin Development Environment ([PDE](https://www.eclipse.org/pde/)) project.

In eclipse `NewProjectCreationOperation` is called at the end of eclipse new plugin wizard ([org.eclipse.pde.ui.templates.NewPluginProjectFromTemplateWizard](https://github.com/eclipse/eclipse.pde.ui/blob/master/ui/org.eclipse.pde.ui/src/org/eclipse/pde/ui/templates/NewPluginProjectFromTemplateWizard.java)) and initialize a new eclipse plugin project according to the choices done by the user during the wizard steps.

I just simplified the pde code by removing every UI related dependencies and replacing the object holding the
wizard inputs by static fields directly in the class (for simplicity sake).

The minimal set of dependencies needed to make the following code work is:
- org.eclipse.core.runtime;bundle-version="3.13.0"
- org.eclipse.core.resources;bundle-version="3.12.0"
- org.eclipse.jdt.core;bundle-version="3.13.0"
- org.eclipse.pde.core;bundle-version="3.11.100"

The entry point is the `execute` method that will create an minimal eclipse plugin project named "*myPlugin*".

```java
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IFolder;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.jdt.core.IClasspathEntry;
import org.eclipse.jdt.core.IJavaElement;
import org.eclipse.jdt.core.IJavaProject;
import org.eclipse.jdt.core.IPackageFragment;
import org.eclipse.jdt.core.IPackageFragmentRoot;
import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.JavaModelException;
import org.eclipse.pde.core.build.IBuildEntry;
import org.eclipse.pde.core.build.IBuildModelFactory;
import org.eclipse.pde.core.plugin.IPluginBase;
import org.eclipse.pde.core.plugin.IPluginLibrary;
import org.eclipse.pde.internal.core.ClasspathComputer;
import org.eclipse.pde.internal.core.ICoreConstants;
import org.eclipse.pde.internal.core.TargetPlatformHelper;
import org.eclipse.pde.internal.core.build.WorkspaceBuildModel;
import org.eclipse.pde.internal.core.bundle.BundlePluginBase;
import org.eclipse.pde.internal.core.bundle.WorkspaceBundlePluginModel;
import org.eclipse.pde.internal.core.bundle.WorkspaceBundlePluginModelBase;
import org.eclipse.pde.internal.core.ibundle.IBundle;
import org.eclipse.pde.internal.core.ibundle.IBundlePluginBase;
import org.eclipse.pde.internal.core.ibundle.IBundlePluginModelBase;
import org.eclipse.pde.internal.core.natures.PDE;
import org.eclipse.pde.internal.core.plugin.WorkspacePluginModelBase;
import org.eclipse.pde.internal.core.project.PDEProject;
import org.eclipse.pde.internal.core.util.CoreUtility;
import org.osgi.framework.Constants;

public class PluginApplicationCreator {
	private WorkspacePluginModelBase fModel;
	private final String version = "0.0.0";
	private final String sourceFolderName = "src";
	private final String outputFolderName = "bin";
	private final String confExecutionEnvironment = "JavaSE-1.8";
	private final String bundleId = "myPluginBundleId";
	private final String configTargetVersion = "3.8";
	private final String projectName = "myPlugin";

	public static void main(final String[] args) throws CoreException {
		new PluginApplicationCreator().execute();
	}

	public void execute() throws CoreException {
		final IProject project = this.createProject();

		if (project.hasNature(JavaCore.NATURE_ID)) {
			setClasspath(project);
		}

		createManifest(project);
		createBuildPropertiesFile(project);

		// not sure when this call is usefull.
		adjustManifests(null, project, fModel.getPluginBase());

		fModel.save();

	}

	private void adjustManifests(final IProgressMonitor monitor, final IProject project, final IPluginBase bundle)
			throws CoreException {
		final IPluginLibrary[] libs = fModel.getPluginBase().getLibraries();
		final Set<String> packages = new TreeSet<>();
		for (final IPluginLibrary lib : libs) {
			final String[] filters = lib.getContentFilters();
			// if a library is fully exported, then export all source packages (since we
			// don't know which source folders go with which library)
			if (filters.length == 1 && filters[0].equals("**")) {
				addAllSourcePackages(project, packages);
				break;
			}
			for (final String filter : filters) {
				if (filter.endsWith(".*"))
					packages.add(filter.substring(0, filter.length() - 2));
			}
		}
		if (!packages.isEmpty()) {
			final IBundle iBundle = ((WorkspaceBundlePluginModelBase) fModel).getBundleModel().getBundle();
			iBundle.setHeader(Constants.EXPORT_PACKAGE, getCommaValuesFromPackagesSet(packages, version));
		}
	}

	private void addAllSourcePackages(final IProject project, final Set<String> list) {
		try {
			final IJavaProject javaProject = JavaCore.create(project);
			final IClasspathEntry[] classpath = javaProject.getRawClasspath();
			for (final IClasspathEntry entry : classpath) {
				if (entry.getEntryKind() == IClasspathEntry.CPE_SOURCE) {
					final IPath path = entry.getPath().removeFirstSegments(1);
					if (path.segmentCount() > 0) {
						final IPackageFragmentRoot root = javaProject.getPackageFragmentRoot(project.getFolder(path));
						final IJavaElement[] children = root.getChildren();
						for (final IJavaElement element : children) {
							final IPackageFragment frag = (IPackageFragment) element;
							if (frag.getChildren().length > 0 || frag.getNonJavaResources().length > 0)
								list.add(element.getElementName());
						}
					}
				}
			}
		} catch (final JavaModelException e) {
		}
	}

	private void createBuildPropertiesFile(final IProject project) throws CoreException {
		final IFile file = PDEProject.getBuildProperties(project);
		if (!file.exists()) {
			final WorkspaceBuildModel model = new WorkspaceBuildModel(file);
			final IBuildModelFactory factory = model.getFactory();

			// BIN.INCLUDES
			final IBuildEntry binEntry = factory.createEntry(IBuildEntry.BIN_INCLUDES);
			fillBinIncludes(project, binEntry);
			model.getBuild().add(binEntry);
			model.save();
		}
	}

	private void fillBinIncludes(final IProject project, final IBuildEntry binEntry) throws CoreException {
		binEntry.addToken(ICoreConstants.PLUGIN_FILENAME_DESCRIPTOR);
		binEntry.addToken("META-INF/");
	}

	private void setClasspath(final IProject project) throws JavaModelException, CoreException {
		final IJavaProject javaProject = JavaCore.create(project);
		// Set output folder
		if (outputFolderName != null) {
			final IPath path = project.getFullPath().append(outputFolderName);
			javaProject.setOutputLocation(path, null);
		}
		final IClasspathEntry[] entries = getClassPathEntries(javaProject);
		javaProject.setRawClasspath(entries, null);
	}

	private IProject createProject() throws CoreException {

		final IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();
		final IProject project = root.getProject(projectName);
		project.delete(true, null);
		project.create(null);
		project.open(null);

		CoreUtility.addNatureToProject(project, PDE.PLUGIN_NATURE, null);
		CoreUtility.addNatureToProject(project, JavaCore.NATURE_ID, null);
		final IFolder folder = project.getFolder(sourceFolderName);
		if (!folder.exists())
			CoreUtility.createFolder(folder);
		return project;
	}

	private IClasspathEntry[] getClassPathEntries(final IJavaProject project) {
		final IClasspathEntry[] internalClassPathEntries = getInternalClassPathEntries(project);
		final IClasspathEntry[] entries = new IClasspathEntry[internalClassPathEntries.length + 2];
		System.arraycopy(internalClassPathEntries, 0, entries, 2, internalClassPathEntries.length);

		// Set EE of new project
		String executionEnvironment = null;
		executionEnvironment = confExecutionEnvironment;
		ClasspathComputer.setComplianceOptions(project, executionEnvironment);
		entries[0] = ClasspathComputer.createJREEntry(executionEnvironment);
		entries[1] = ClasspathComputer.createContainerEntry();

		return entries;
	}

	private IClasspathEntry[] getInternalClassPathEntries(final IJavaProject project) {
		if (sourceFolderName == null) {
			return new IClasspathEntry[0];
		}
		final IClasspathEntry[] entries = new IClasspathEntry[1];
		final IPath path = project.getProject().getFullPath().append(sourceFolderName);
		entries[0] = JavaCore.newSourceEntry(path);
		return entries;
	}

	private void createManifest(final IProject project) throws CoreException {
		final IFile fragmentXml = PDEProject.getFragmentXml(project);
		final IFile pluginXml = PDEProject.getPluginXml(project);
		final IFile manifest = PDEProject.getManifest(project);
		fModel = new WorkspaceBundlePluginModel(manifest, pluginXml);
		final IPluginBase pluginBase = fModel.getPluginBase();
		final String targetVersion = configTargetVersion;
		pluginBase.setSchemaVersion(TargetPlatformHelper.getSchemaVersionForTargetVersion(targetVersion));
		pluginBase.setId(bundleId);
		pluginBase.setVersion(version);
		pluginBase.setName(projectName);
		pluginBase.setProviderName("");
		if (fModel instanceof IBundlePluginModelBase) {
			final IBundlePluginModelBase bmodel = ((IBundlePluginModelBase) fModel);
			((IBundlePluginBase) bmodel.getPluginBase()).setTargetVersion(targetVersion);
			bmodel.getBundleModel().getBundle().setHeader(Constants.BUNDLE_MANIFESTVERSION, "2");
		}

		final IBundle bundle = ((BundlePluginBase) pluginBase).getBundle();
		final String exeEnvironment = confExecutionEnvironment;
		if (exeEnvironment != null) {
			bundle.setHeader(Constants.BUNDLE_REQUIREDEXECUTIONENVIRONMENT, exeEnvironment);
		}
	}

	private String getCommaValuesFromPackagesSet(final Set<String> values, final String version) {
		final StringBuffer buffer = new StringBuffer();
		final Iterator<String> iter = values.iterator();
		while (iter.hasNext()) {
			if (buffer.length() > 0) {
				buffer.append(",\n "); // space required for multiline headers
			}
			final String value = iter.next().toString();
			buffer.append(value);

			if (value.indexOf(";version=") == -1 && (version != null) && (values.size() == 1)) {
				buffer.append(";version=\"").append(version).append("\""); //$NON-NLS-2$
			}
		}
		return buffer.toString();
	}

}
```

It feels like this code could be heavily simplified, but it does the job.
