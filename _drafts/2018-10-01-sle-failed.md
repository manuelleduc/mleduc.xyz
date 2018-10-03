---
layout: post
title: Software Language Engineering failed!?
date:   2018-10-01 12:37:00 +0200
categories: software language engineering sle
---

# Introduction

> The hardest program I’ve ever written, once you strip out the whitespace, is 3,835 lines long. That handful of code took me almost a year to write. Granted, that doesn’t take into account the code that didn’t make it. The [commit history](https://github.com/dart-lang/dart_style/commits/master) shows that I deleted 20,704 lines of code over that time. Every surviving line has about three fallen comrades

Reading this in the words of Bob Nystrom, successful game developer and programming language expert, in his article [The Hardest Program I've Ever Written](http://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/), was quite a painful paragraph to read.

How can somebody frequently in front page of Hacker News ([stuffwithstuff.com](https://news.ycombinator.com/from?site=stuffwithstuff.com) / [craftinginterpreters.com](https://news.ycombinator.com/from?site=craftinginterpreters.com)) be struggling to implement a code formatting library ?

To understand why it is such a shock for me to read this, I have to explain that I am a PhD in Software Language Engineering.
Consequently, I am often prototyping languages for my experiments and so far I never had to struggle with the formatting of my language.

As I read that, I wondered why the technologies I know are not actually being used.

# A case for SLE

Many meta-languages are now available to define languages, solutions such as Xtext, Rascal, and Spoofax are specialized tools dedicated to the definition of every aspects of languages (i.e. concrete syntax, abstract syntax, semantics) and their accompanying tools (i.e. checking, formatting, refactoring, outline definition, linking...).

Based on dedicated meta-languages, defining aspects of a language is usually effortless, at least compared to the realization of the same feature using a plain old General Purpose Language (GPL).

The [sample below](#domain-model-xtext-sample) is the 25 lines definition of the concrete syntax of a simple domain model language using xtext (copied from the [official documentation](https://www.eclipse.org/Xtext/documentation/104_jvmdomainmodel.html)).

Compared to the large amount of highly specific source code necessary to implements the same task in Java of C++, it seems clear that using Xtext is the way to go.


# A case against SLE

So why are language designer willing to invest hours of effort into the implementation of language using GPL when such highly dedicated solutions are available.

One of the answer migth be the lack of visibility our community provides to the existing solutions, but I am not convinced this is the only answer.

Reading from Bob's article, we can find a set of other aswers.

First, he express the need for code formatter highly fitted to his own requirements, such level of customizability might not be always provided by the SLE tools.

Execution speed is also cited as a strong requirement,

- Quality and Customability of the formatter
- Speed
- Missing initial formal definition of the grammar
- Boot-strapping ?


# The future

While I've identified many weaknesses of the SLE approach, the Dart community showed me some hope.

In the video below, Erik Ernst, member of the Dart language team and maintainer of the language specification and associate professor at Aarhus University, Denmark, explains why they introduced a formal specification of the concrete syntax of Dart using ANTLR.

<div style="text-align: center;">
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ymAodmjdvic?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>


So while SLE solutions are not yet widely applied, this highlight the positive impacts it can has on existing language implementation, even if not applied on the full spectrum of language features and properties.




# The Software Language Engineering standpoint

Declarative parser

## Xtext

https://www.eclipse.org/Xtext/documentation/303_runtime_concepts.html#formatting


## Spoofax


## Rascal MPL

# Arguments agains SLE Tools

- Quality and Customability of the formatter
- Speed
- Missing initial formal definition of the grammar
- Boot-strapping ?

# What we should do better

Advertise our tools.
Listen to the language designer and address the issue they have with what we propose.

# Conclusion

## Domain Model Xtext Sample
```xtext
grammar org.example.domainmodel.Domainmodel with org.eclipse.xtext.xbase.Xbase
generate domainmodel "http://www.example.org/domainmodel/Domainmodel"

Domainmodel:
  importSection=XImportSection?
  elements+=AbstractElement*;

AbstractElement:
  PackageDeclaration | Entity;

PackageDeclaration:
  'package' name=QualifiedName '{'
    elements+=AbstractElement*
  '}';

Entity:
  'entity' name=ValidID ('extends' superType=JvmTypeReference)? '{'
    features+=Feature*
  '}';

Feature:
  Property | Operation;

Property:
  name=ValidID ':' type=JvmTypeReference;

Operation:
  'op' name=ValidID
    '('(params+=FullJvmFormalParameter
    (',' params+=FullJvmFormalParameter)*)?')'
    ':' type=JvmTypeReference
  body=XBlockExpression;
```
