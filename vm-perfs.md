---
layout: default
title: Java Virtual Machine performance
hidden: true
sitemap: false
---

<style type="text/css">
img {
    width: 90%;
}
</style>


# Java Virtual Machine performance

In the last few years we went from a really limited choice of mainstream JVMs (basically [Oracle's JVM](https://www.oracle.com/technetwork/java/index.html) and [Openjdk](https://openjdk.java.net/)), to four wildely distributed JVM, with the introduction of [OpenJ9](https://www.eclipse.org/openj9/), recently open-sourced under Eclipse's direction and [GraalVM](https://www.graalvm.org/), by Oracle Lab.

And with such diversity arrive the question of the criterias on which to base our JVM choice.

In front of the limitless combination of criterias to base our choice on, we will focus on the following: the execution time of programs executed on Domain-Specific Languages (DSLs) developped in Java.

We are going to identified the force and weakness of multiple JVM implementation by measuring their execution time on the execution of various programs on various DSLs, all described below.
Then, we first compare their performance in term of pure execution time, and in term of stability (does the performance of a single program vary between two executions?).
Finally, we question the influence of the languages implementation patterns in the runtime performance.

## Data

In this first part, we describe the languages and programs used in our benchmarks.

### Languages and Programs

DSLs implementation can be separated in two broad categories: *Internal* and *External* , according to the way they are implemented.
The distinction is nicely described by [Martin Fowler](https://martinfowler.com/books/dsl.html) and can be summarized as follow:
an *Internal* DSL rely on the syntax of the host language and can also be seen as a language's library build in a way that fake a programming language.
Internal DSLs are also often called [Fluent API](https://en.wikipedia.org/wiki/Fluent_interface).
In comparison, *External* DSLs are based on their own syntax and semantics. 
Even if External DSL does not rely on an host language syntax, they still need to be implemented using an existing language (for instance the official Python implementation, CPython, is implemented in C).
While the implementation of External DSL can be more cumbersome at first, doing so allow more flexibility when fine customization of the language is needed.

In this article we focus on External DSL implemented in Java: **MiniJava**, **Boa**, **FSM** and **Logo**.

To evaluate our results, we implemented four languages: **MiniJava** a teaching-oriented subset of Java, a functional language inspired by OCaml named **Boa**, a system of finite-state machines language (**FSM**), and the educational procedural **Logo** language.
MiniJava is used to implement the Fibonacci algorithm (**minijava_fibonacci**), a bubble sort algorithm (**minijava_sort**), a **binarytree** manipulation algorithm, and an implementation
of the **fannkuchredux** algorithm.
Boa is used to implement a Fibonacci algorithm (**boa_fibonacci**) and an insert sort algorithm (**boa_sort**).
The FSM language is used to define a set of four communicating state machines, sending messages to each other (**buffer**).
Finally, the Logo language is used to define a program that draw a Koch snowflake fractal (**fractal**).

By measuring the performance of the selection of languages and programs, our goal is to cover a large set of cases and usages: two general-purpose programming languages with different paradigms, a modeling language, and an “end-user” language.
For the languages with paradigms allowing various sort of implementation, we propose programs covering different styles from arithmetic intensive programs to structure  intensive programs, and from recursive style to iterative style.


### Virtual Machines

#### GraalVM EE

Java 8

#### GraalVM CE

Java 8

#### OpenJ9

Java 8, 11, 12

#### OpenJDK

Java 8, 11, 12


## Setup

TODO: Measurement methodology.

## Results


[![](vm-perfs-figures/no_warmupinterpreter + boa_fibonacci.svg)](vm-perfs-figures/no_warmupinterpreter + boa_fibonacci.svg)
[![](vm-perfs-figures/no_warmupinterpreter + boa_sort.svg)](vm-perfs-figures/no_warmupinterpreter + boa_sort.svg)
[![](vm-perfs-figures/no_warmupinterpreter + buffers.svg)](vm-perfs-figures/no_warmupinterpreter + buffers.svg)
[![](vm-perfs-figures/no_warmupinterpreter + fractal.svg)](vm-perfs-figures/no_warmupinterpreter + fractal.svg)
[![](vm-perfs-figures/no_warmupinterpreter + minijava_binarytree.svg)](vm-perfs-figures/no_warmupinterpreter + minijava_binarytree.svg)
[![](vm-perfs-figures/no_warmupinterpreter + minijava_fannkuchredux.svg)](vm-perfs-figures/no_warmupinterpreter + minijava_fannkuchredux.svg)
[![](vm-perfs-figures/no_warmupinterpreter + minijava_fibonacci.svg)](vm-perfs-figures/no_warmupinterpreter + minijava_fibonacci.svg)
[![](vm-perfs-figures/no_warmupinterpreter + minijava_sort.svg)](vm-perfs-figures/no_warmupinterpreter + minijava_sort.svg)




## Trends and Discussions


## Futher discussion: Implementation patterns

[![](vm-perfs-figures/no_warmuprevisitor + boa_fibonacci.svg)](vm-perfs-figures/no_warmuprevisitor + boa_fibonacci.svg)
[![](vm-perfs-figures/no_warmuprevisitor + boa_sort.svg)](vm-perfs-figures/no_warmuprevisitor + boa_sort.svg)
[![](vm-perfs-figures/no_warmuprevisitor + buffers.svg)](vm-perfs-figures/no_warmuprevisitor + buffers.svg)
[![](vm-perfs-figures/no_warmuprevisitor + fractal.svg)](vm-perfs-figures/no_warmuprevisitor + fractal.svg)
[![](vm-perfs-figures/no_warmupswitch + boa_fibonacci.svg)](vm-perfs-figures/no_warmupswitch + boa_fibonacci.svg)
[![](vm-perfs-figures/no_warmupswitch + boa_sort.svg)](vm-perfs-figures/no_warmupswitch + boa_sort.svg)
[![](vm-perfs-figures/no_warmupswitch + buffers.svg)](vm-perfs-figures/no_warmupswitch + buffers.svg)
[![](vm-perfs-figures/no_warmupswitch + fractal.svg)](vm-perfs-figures/no_warmupswitch + fractal.svg)
[![](vm-perfs-figures/no_warmupvisitor + boa_fibonacci.svg)](vm-perfs-figures/no_warmupvisitor + boa_fibonacci.svg)
[![](vm-perfs-figures/no_warmupvisitor + boa_sort.svg)](vm-perfs-figures/no_warmupvisitor + boa_sort.svg)
[![](vm-perfs-figures/no_warmupvisitor + fractal.svg)](vm-perfs-figures/no_warmupvisitor + fractal.svg)

## Conclusion

