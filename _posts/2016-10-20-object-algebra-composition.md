---
layout: post
title: Object Algebra Composition
date : 2016-10-20 14:21:33 +0200
categories: scala object
tags: object algebra composition
---

# Introduction

This article is composed of two parts. The first part explains the concept of "object algebra" using a toy example. The second part reuse the same toy example and extends it.

# Object algebra

The expression problem, as presented in  [Oleksandr Manzyuk's blog](https://oleksandrmanzyuk.wordpress.com/2014/06/18/from-object-algebras-to-finally-tagless-interpreters-2/#sec-2), is a way to offer the capability for a DSL to be extensible either in term of operations and in term of expression types.

After reading [Extensibility for the Masses - *Practical Extensibility with Object Algebras*](http://www.cs.utexas.edu/~wcook/Drafts/2012/ecoop2012.pdf) I decided to give it a look and tried to add a few more features to the [example](http://i.cs.hku.hk/~bruno/oa/) provided by the authors.

The architecture of the program is summarized in the following diagram :
![Schema Example Architecture]({{ site.baseurl }}/assets/2016-10-20-object-algebra-composition/object_algebra_example.svg)

**PPrint** and **Eval** are two operations which respectivelly pretty print a program and eval it to an integer.

```scala
trait Eval {
  def eval() : Int
}

trait PPrint {
  def print() : String
}
```

**ExpAlg** and **SubExpAlg** are *object algebra interfaces* which can be used to define programs of the language. ExpAlg provides to operations `lit(x: Int)` and `add(e1: E, e2: E)` . SubExpAlg inherits from ExpAlg and add the notion of subtraction with the `sub(e1: E, e2: E)` method.

```scala
trait ExpAlg[E] {
  def lit(x : Int) : E
    def add(e1 : E, e2 : E) : E
}

trait SubExpAlg[E] extends ExpAlg[E] {
  def sub(e1 : E, e2 : E) : E
}
```

The interpreters of the language are named *object algebras*. **EvalExpAlg** interprets  **ExpAlg** programs and evaluate an integer.

**EvalSubExpAlg** inherits of **EvalExpAlg** and evaluates **SubExpAlg** programs.

**PrintExpAlg** evaluates **EvalExpAlg** programs and return a string representation.

Since both **PrintExpAlg** and **EvalSubExpAlg** are able to interpret **SubExpAlg** they are also able to interpret any language previously defined using **ExpAlg**.

> This point is very important in language reuse. Using object algebra a developer
>
> * is able to extend a language without modifications of the existing code base.
> * know that any program written with a current version of an algebra will be interpretable as well with any future extended interpreters of the language

In conclusion of this section, an example of the usage of our languages.

```scala
object Examples extends App {
  def exp1[E](alg : ExpAlg[E]) = {
    import alg._
      add(lit(3), lit(4))
  }
	
  // An expression using subtraction too
  def exp2[E](alg : SubExpAlg[E]) = {
    import alg._
      sub(exp1(alg), lit(4))
  }
  
  def test() : Unit = {
    val ea = new EvalExpAlg() {}
    val esa = new EvalSubExpAlg() {}
    val pa = new PrintExpAlg() {}
    val pa2 = new PrintExpAlg2() {}
    println("Evaluation of exp1 \"" + exp1(pa).print() + "\" is: " + exp1(esa).eval())
    // Evaluation of exp1 "3 + 4" is: 7
    println("Evaluation of exp2 \"" + exp2(pa).print() + "\" is: " + exp2(esa).eval())
    // Evaluation of exp2 "3 + 4 - 4" is: 3
  }
  
  text()
}
```

# Extending an Object algebra

In order to study the advantages and limitation of this approach we are going to extend the previously explained use case with the notions of boolean operations (&&, \|\|, ==, !). We will also offer a way to guaranty that the left and side and right and side of the `==` operator are of the same type.

![Schema Example Architecture]({{ site.baseurl }}/assets/2016-10-20-object-algebra-composition/object_algebra_extended.svg)

## Boolean operations

The first step is to create a language dedicated to the definition of boolean operation, the *object algebra interface* **BoolExpAlg** (the type definition might be hard to understand and will be detail in the next section).

```scala
trait BoolExpAlg[A, E <: A] {
  def trueE(): E
  def falseE(): E
  def and(left: E, right: E): E
  def or(left: E, right: E): E
  def not(exp: E): E
  def equal[F1 <: A, F2 <: A](left: F1, right: F2)(implicit ev: F1 =:= F2): E
}
```

We are now able to define the corresponding *object algebras* for boolean interpretation and pretty printing.

But first we are going to update the definition of the **Eval** trait and add a parametrized type.

```scala
trait Eval[X] {
	def eval(): X
}
```

By doing so we allow the *object algebras* of integer and boolean to share a common type.

Now that it done, here is the code of the *object algebras*. 

```scala
trait EvalBoolExpAlg extends BoolExpAlg[Eval[_], Eval[Boolean]] {
  override def falseE(): Eval[Boolean] = new Eval[Boolean] {
    override def eval(): Boolean = false
  }

  override def trueE(): Eval[Boolean] = new Eval[Boolean] {
    override def eval(): Boolean = true
  }

  override def and(left: Eval[Boolean], right: Eval[Boolean]) = new Eval[Boolean] {
    override def eval(): Boolean = left.eval() && right.eval()
  }

  override def equal[F1 <: Eval[_], F2 <: Eval[_]](left: F1, right: F2)(implicit ev: =:=[F1, F2]): Eval[Boolean] = new Eval[Boolean] {
    override def eval(): Boolean = left.eval() == right.eval()
  }

  override def not(exp: Eval[Boolean]): Eval[Boolean] = new Eval[Boolean] {
    override def eval(): Boolean = !exp.eval()
  }

  override def or(left: Eval[Boolean], right: Eval[Boolean]): Eval[Boolean] = new Eval[Boolean] {
    override def eval(): Boolean = left.eval() || right.eval()
  }
}

trait BoolExpAlg[A, E <: A] {
  def trueE(): E
    def falseE(): E
    def and(left: E, right: E): E
    def or(left: E, right: E): E
    def not(exp: E): E
    def equal[F1 <: A, F2 <: A](left: F1, right: F2)(implicit ev: F1 =:= F2): E
}
```

For now we have a new language dedicated to the definition and interpretation of boolean expressions, completely decouple from our previous languages definitions.

An example of program in this language :

```scala
def program3[F, E <: F](alg: BoolExpAlg[F, E]): E = {
  import alg._
  equal(trueE(), falseE())
}

val printB: PrintExpBoolAlg with Object = new PrintExpBoolAlg() {}
val evalB: EvalBoolExpAlg with Object = new EvalBoolExpAlg() {}
println(s"""${program3(printB).print()} ---> ${program3(evalB).eval()}""")
// (true == false) ---> false
```

## Language composition

We are now at a point where we can ask ourselves, can I mix easily my integer language with my boolean ? 

I hope that the following program will proves you that the answer is yes !

```scala
def program4[F, E <: F, G <: F](alg: BoolExpAlg[F, E] with SubExpAlg[G]): E = {
  import alg._
  equal(lit(1), sub(lit(2), lit(1)))
}

val printIB: PrintExpBoolAlg with PrintExpAlg with Object = new PrintExpBoolAlg() with PrintExpAlg {}
val evalIB: EvalBoolExpAlg with EvalSubExpAlg with Object = new EvalBoolExpAlg() with EvalSubExpAlg {}
println(s"""${program4(printIB).print()} ---> ${program4(evalIB).eval()}""")
// (1 == 2 - 1) ---> true
```

Only by reusing the previously defined definitions and using [traits compositions](http://docs.scala-lang.org/tutorials/tour/mixin-class-composition.html). We have defined a language supporting the evaluation of integer expressions, boolean expression and especially the evaluation of the equality of two integer using a boolean operator !

## More details about the equality.

I wanted the equal operation of be type-safe. In other words in did not want the `equal` operation to be able to compare apple and bananas (or integer and boolean).

```scala
def program4[F, E <: F, G <: F](alg: BoolExpAlg[F, E] with SubExpAlg[G]): E = {
  import alg._
  val p1 = equal(trueE(), lit(1)) // does not compile !
}
```

But in the other hand I wanted my `equal` operation to be extensible. Any new language with comparable elements must be able to reuse this operation easily.

To meet those two objectives the following pieces of code have been needed.

```scala
// object algebra interface :
trait BoolExpAlg[A, E <: A] { // knowing a type A, E is a subtype of A
  // [...]
  
  // knowing a type A, F1 and F2 are both subtype of A
  // the implicit enforce the type equality of F1 and F2 si both F1 and F2 are different subtypes of A, the scala refuses to compile.
  def equal[F1 <: A, F2 <: A](left: F1, right: F2)(implicit ev: F1 =:= F2): E
}

// Eval[_] defines that anything "evaluable" is accepted in the equal method.
// Eval[Bool] defines the type of the object algebra itself.
trait EvalBoolExpAlg extends BoolExpAlg[Eval[_], Eval[Boolean]] {
  
  // the signature of the equal method, derived from the previous type definition
  override def equal[F1 <: Eval[_], F2 <: Eval[_]](left: F1, right: F2)(implicit ev: =:=[F1, F2]): Eval[Boolean] = new Eval[Boolean] {
    override def eval(): Boolean = left.eval() == right.eval()
  }

  }
```

# Conclusion

For now my opinion of object algebra is optimistic and even if the development of more complex DSL might lead to unexpected issues, the implementation of this small example have been surprisingly easy.

We can still observe that in order to add more flexibility we had to edit once a previously defined code. This is not mandatory and more verbose solution might be envisioned to do the same thing without touching any previously defined source code.

Also finding out a working definition of **BoolExpAlg** was not straightforward (but I am not an experienced Scala developer !).

The full code of the snippets found in the article can be found here : [https://gist.github.com/manuelleduc/2607f15407017daf0d6ae9a987ece243](https://gist.github.com/manuelleduc/2607f15407017daf0d6ae9a987ece243)

I hope this article gave you a first insight of the advantages and limitations of this approach of DSL definition and reuse.

# Good reads

I have been introduced to the concept of object algebra by this awesome talk :  "[Using Object Algebras To Design Embedded Domain Specific Languages](https://www.youtube.com/watch?v=snbsYyBS4Bs)" by [Julien Richard-Foy](http://julien.richard-foy.fr/) at [Curry On'16](http://curry-on.org/2016/).