+++
title = 'FeatureIDE Programmatically: Getting Started'
date = 2017-11-28 17:36:00+02:00
url = '/eclipse/2017/11/28/feature-ide-programmatically-getting-started.html'
+++

**Update \#1** *Tuesday, December 12, 2017*: First update of the article with some improvement from my recent experiments with FeatureIDE API. The code is much cleaner and reasoning with the configurations is improved. I have added comments along the article explaining the changes.

---

Part of my research and engineering activities are currently focused on the variability aspect of software languages.

IMHO, [FeatureIDE](https://featureide.github.io/) is the best plugin to deal with the expression of the variability of software components, using [Feature Models](https://en.wikipedia.org/wiki/Feature_model).

It has been nicely refactored over the time in order to be modular and it is now possible to import only the Feature Model syntax and semantics without importing the UI dependencies.

Nonetheless, I've spend enough time digging in the code this afternoon to feel like what I did could be helpful to others.

The following piece of java code is an example of how to easily define a Feature Model and to check some simple properties on it.

It depends on `de.ovgu.featureide.fm.core;bundle-version="3.4.1"` (FeatureIDE [update site](http://featureide.cs.ovgu.de/update/v3/) and [source code](https://github.com/FeatureIDE/FeatureIDE))

```java
package fr.inria.diverse.melange;

import java.util.List;

import org.sat4j.specs.TimeoutException;

import de.ovgu.featureide.fm.core.base.IFeature;
import de.ovgu.featureide.fm.core.base.IFeatureModel;
import de.ovgu.featureide.fm.core.base.IFeatureModelStructure;
import de.ovgu.featureide.fm.core.base.IFeatureStructure;
import de.ovgu.featureide.fm.core.base.impl.DefaultFeatureModelFactory;
import de.ovgu.featureide.fm.core.base.impl.FMFactoryManager;
import de.ovgu.featureide.fm.core.base.impl.Feature;
import de.ovgu.featureide.fm.core.configuration.Configuration;
import de.ovgu.featureide.fm.core.configuration.SelectableFeature;
import de.ovgu.featureide.fm.core.configuration.Selection;

public class SimpleFeatureModel {
  public static void main(final String[] args) throws TimeoutException {
  final IFeatureModel fm = FMFactoryManager.getEmptyFeatureModel();
  final DefaultFeatureModelFactory factory = DefaultFeatureModelFactory.getInstance();
  final Feature fexp = factory.createFeature(fm, "Expression");
  final Feature fas = factory.createFeature(fm, "AS");
  final Feature fadd = factory.createFeature(fm, "Add");

  final Feature fecl = factory.createFeature(fm, "Ecl");
  final Feature fa1 = factory.createFeature(fm, "A1");
  final Feature fa2 = factory.createFeature(fm, "A2");

  final IFeatureStructure fexpStructure = fexp.getStructure();
  final IFeatureModelStructure fmStructure = fm.getStructure();
  final IFeatureStructure fasStructure = fas.getStructure();
  final IFeatureStructure feclStructure = fecl.getStructure();
  final IFeatureStructure faddStructure = fadd.getStructure();
  final IFeatureStructure fa1Structure = fa1.getStructure();
  final IFeatureStructure fa2Structure = fa2.getStructure();

  fmStructure.setRoot(fexpStructure);
  fm.addFeature(fexp);
  fm.addFeature(fas);
  fm.addFeature(fadd);
  fm.addFeature(fecl);
  fm.addFeature(fa1);
  fm.addFeature(fa2);

  fexpStructure.addChild(fasStructure);

  fexpStructure.addChild(faddStructure);

  fexpStructure.addChild(feclStructure);
  feclStructure.setAlternative();

  feclStructure.addChild(fa1Structure);
  feclStructure.addChild(fa2Structure);

  fasStructure.setMandatory(true);

  final Configuration conf = new Configuration(fm);
  conf.setManual("A1", Selection.SELECTED);
  System.out.println("Can be valid: " + conf.canBeValid());
  System.out.println("Solutions: " + conf.number());
  final List<List<String>> solutions = conf.getSolutions(Long.valueOf(conf.number()).intValue());
  System.out.println("Free feature (SELECTED/UNSELECT choice left open): ");
  for (IFeature a : conf.getUndefinedSelectedFeatures()) {
  System.out.println(a);
  }

  System.out.println("Status of the features");
  for (SelectableFeature feature : conf.getFeatures()) {
  System.out.println(feature + " " + feature.getSelection());
  }

  System.out.println("Possible solutions so far:");
  for (final List<String> solution : solutions) {
  System.out.println(solution);
  }

  /*
   * Can be valid: true
   * Solutions: 2
   * Still free variables:
   * Add
   * Status of the features
   * Expression SELECTED
   * AS SELECTED
   * Add UNDEFINED
   * Ecl SELECTED
   * A1 SELECTED
   * A2 UNSELECTED
   * Possible solutions
   * [Expression, AS, Ecl, A1]
   * [Expression, AS, Ecl, A1, Add]
   */

  }
}

```


The last lines, with the configuration analysis is really nice and allow to reason on the Feature Models easily.

**Update #1 notes:** I'm still hoping to find a pretty printing of the feature model somewhere in the API, to help me with the debugging.

But the initialization of the Feature Model has a few code smells that I'd like to remove. For instance, in order to add a sub-feature to the Feature Model it is required to:
- add the feature to the Feature Model (i.e. `addFeature`)
- attach the feature to its parent (i.e. `setParent`)
- add the child to the list of children of its parent (e.g. `getChildren().add(fas.getStructure())`).


**Update #1 notes:** `setParent` + `getChildren().add(fas.getStructure())` can be nicely replace by a single `parent.addChild(child)`.



Also a lot of those operations requires a kind of lifting from the feature to its structure.

~~The aggregation of all those small details makes the Feature Model instantiation hard to read and error prone. I'm sure it can be improved, either by a better use of the library (which is likely since I've only spend a few hours on it so far) or by defining some utility methods client side.~~

**Update #1 notes:** As expected, with a better knowledges of the API, the code quality, if not yet as good as hoped, improved significantly.

I'll keep updating this article whenever I manage to find useful FeatureIDE API tips.
