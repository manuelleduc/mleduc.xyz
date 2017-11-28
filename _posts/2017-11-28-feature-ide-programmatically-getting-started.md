---
layout: post
title: 'FeatureIDE Programmatically: Getting Started'
date : 2017-11-28 17:36:00 +0200
categories: eclipse
tags: feature ide eclipse model programmatically
---

Part of my research and engineering activities are currently focused on the variability aspect of software languages.

IMHO, [FeatureIDE](https://featureide.github.io/) is the best plugin to deal with the expression of the variability of software components, using [Feature Models](https://en.wikipedia.org/wiki/Feature_model).

It has been nicely refactored over the time in order to be modular and it is now possible to import only the Feature Model syntax and semantics without importing the UI dependencies.

Nonetheless, I've spend enough time digging in the code this afternoon to feel like what I did could be helpful to others.

The following piece of java code is an example of how to easily define a Feature Model and to check some simple properties on it.


```java
package fr.inria.diverse.melange;

import org.sat4j.specs.TimeoutException;

import de.ovgu.featureide.fm.core.base.IFeatureModel;
import de.ovgu.featureide.fm.core.base.impl.DefaultFeatureModelFactory;
import de.ovgu.featureide.fm.core.base.impl.FMFactoryManager;
import de.ovgu.featureide.fm.core.base.impl.Feature;
import de.ovgu.featureide.fm.core.configuration.Configuration;

public class SimpleFeatureModel {
  public static void main(final String[] args) throws TimeoutException {
    final IFeatureModel fm = FMFactoryManager.getEmptyFeatureModel();
    final DefaultFeatureModelFactory i = DefaultFeatureModelFactory.getInstance();
    final Feature fexp = i.createFeature(fm, "Expression");
    final Feature fas = i.createFeature(fm, "AS");
    final Feature fadd = i.createFeature(fm, "Add");

    fm.addFeature(fexp);
    fm.addFeature(fas);
    fm.addFeature(fadd);
    fm.getStructure().setRoot(fexp.getStructure());
    fexp.getStructure().setMandatory(true);

    fas.getStructure().setParent(fexp.getStructure());
    fas.getStructure().setMandatory(false);
    fexp.getStructure().getChildren().add(fas.getStructure());
    fadd.getStructure().setMandatory(false);
    fadd.getStructure().setParent(fexp.getStructure());
    fexp.getStructure().getChildren().add(fadd.getStructure());


    final Configuration conf = new Configuration(fm);
    System.out.println("Can be valid: " + conf.canBeValid());
    System.out.println("Solutions: " + conf.number());
    System.out.println(conf.getSolutions(Long.valueOf(conf.number()).intValue()));

    /*
    Output:
    Can be valid: true
    Solutions: 4
    [[Expression], [Expression, AS], [Expression, Add], [Expression, AS, Add]]
    */

  }
}
```


The last lines, with the configuration analysis is really nice and allow to reason on the Feature Models easily.

But the initialization of the Feature Model has a few code smells that I'd like to remove. For instance, in order to add a sub-feature to the Feature Model it is required to:
- add the feature to the Feature Model (i.e. `addFeature`)
- attach the feature to its parent (i.e. `setParent`)
- add the child to the list of children of its parent (e.g. `getChildren().add(fas.getStructure())`)

Also a lot of those operations requires a kind of lifting from the feature to its structure.

The aggregation of all those small details makes the Feature Model instantiation hard to read and error prone. I'm sure it can be improved, either by a better use of the library (which is likely since I've only spend a few hours on it so far) or by defining some utility methods client side.

I'll try to update this article as soon as I have more information.
