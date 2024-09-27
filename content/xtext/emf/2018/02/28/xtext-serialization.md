+++
title = 'Xtext Serialization - Easier than I thought'
date = 2018-02-28 11:54:00+02:00
url = '/xtext/emf/2018/02/28/xtext-serialization.html'
tags = [ "xtext", "emf", "serialization" ]
+++

# Introduction

We often think of Xtext as a solution to transform text files into [EMF](https://www.eclipse.org/modeling/emf/) models.
But the opposite is also possible and one can transform a EMF model into a text file.
Such a transformation is and is called *serialization*.


Serializing an EMF model has various use cases, from saving the intermediate representation of a compilation to
operate transformations on a xtext program before transforming it back into text (e.g. optimization, obfuscation...).

# Implementation

I will not go into the details of what might go wrong during the serialization and how to fix it,
but shortly, if the model does not conform to the constraints defined in the xtext file, the serialization will fail.

Solutions to solve such issues are possible but will not be explained here.

Apart from those technical details, serializing a model is a surprisingly simple operation to implement despite the lack
of working example available online.


Let's take an language name **eoh**, the following xtend example shows how to serialize an EMF model to
a valid string in the grammar of eoh.


Three elements are important to the implementation of a serialization:

- The injection must be done using the provider of the language. See the @InjectWith annotation. More details are given in the [Serializing EMF models with Xtext](https://fr.slideshare.net/meysholdt/serializing-emf-models-with-xtext) presentation.
- *org.eclipse.xtext.serializer.impl.Serializer* is injected in the class (using the previously defined provider).
- The serializer is called using the *serialize* method one any EObject instance. Check and generation are done based on the provided language.

```java
package eho.tests

import com.google.inject.Inject
import eho.eho.EhoFactory
import org.eclipse.xtext.serializer.impl.Serializer
import org.eclipse.xtext.testing.InjectWith
import org.eclipse.xtext.testing.XtextRunner
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(XtextRunner)
@InjectWith(EhoInjectorProvider)
class EhoParsingTest {

  @Inject Serializer serializer

  @Test
  def void serializer() {
    val f = EhoFactory.eINSTANCE
    val policy = f.createRoot => [
      // ...
    ]

    println(serializer.serialize(policy))

  }
}
```


# Useful resources

The result presented on this article are mainly an exemplified aggregation of the
following web resources:

- [https://stackoverflow.com/questions/12302206/convert-object-to-xtext-dsl](https://stackoverflow.com/questions/12302206/convert-object-to-xtext-dsl)
- [https://fr.slideshare.net/meysholdt/serializing-emf-models-with-xtext](https://fr.slideshare.net/meysholdt/serializing-emf-models-with-xtext)
- [https://www.eclipse.org/Xtext/documentation/308_emf_integration.html](https://www.eclipse.org/Xtext/documentation/308_emf_integration.html)

