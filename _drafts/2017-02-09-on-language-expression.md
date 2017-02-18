---
layout: post
title: On language expression
date:   2017-02-09 15:29:33 +0200
categories: language expression draft
---

* TOC
{:toc}

## Introduction

Problems to solve:

- Gathering the whole concept of *language* under a name which can be used to refer to it later as a single unit (e.g. A car is referred to as a **car** and not as a motorized vehicle with brakes, wheels and an engine. See how the single word version is either more expressive and easier to use).

- Providing an single consistent language unit which cannot be mixed up improperly with other languages unit (cf. example 1 and 2) respectively by mixing two languages or by mixing a language with its parents types.


## Constraints

As stated in [cite paper] the

- Extensible in both dimensions: semantic and syntactic extensibility
- Strong type safety
- No need to modify of duplicate existing code
- Separate compilation
- Independent extensibility


### Axis

- **Ergonomy:** Easy to reason about. No need to have a PhD in type system to understand the mechanisms behind language definition
- **Legacy:** Can be apply either straightforwardly of with a predetermined set of sequenced operations (automatic/manual) to a legacy codebase
- **Taxonomy:** Should provide a self contained vocabulary specific to its domain.
- **Open world:** Component should be reusable by anyone in a read-only fashion.
- **Transparent reuse:** As far as possible the ability to reuse a language should not be predetermined by the will of the language architect to makes it reusable by future third party (for example it should not be asked to introduce abstract types "in case of" future reuse).


## Examples

### Languages family use case

### FSM language

```
language FSM

type FSM
    container Transition transitions  [0..*]
    container State      states       [0..*]
    refers    State      initialState [1..1]  

type Transition
    refers State from [1..1]
    refers State to   [1..1]

type State
```

### HFSM language

**Using language reuse grammar**

```
language HFSM inherits FSM
// inherits implicitly imports all FSM language types

// TODO : keywork implements to force type conformance checking with the choosen language

override type State
   // NOTE: Should this FSM be defined at the FSM as HFSM.FSM of could we allow any *.FSM to be imported at the model level ?
   container FSM fsm [1..1]
```

**Resulting language**

```
language HFSM

type FSM
    container Transition transitions  [0..*]
    container State      states       [0..*]
    refers    State      initialState [1..1]  

type Transition
    refers State from [1..1]
    refers State to   [1..1]

type State
	container FSM fsm [1..1]
```

### TFSM language

**Using language reuse grammar**

```
language TFSM inherits FSM

override type FSM
	container Clock clocks [0..*]

override type Transition
	refers Clock resets [0..*] // clocks to resetmodifications
	container ClockGuard guard [0..1]
	field String event

override type State
	container ClockGuard guards [0..1]

type Clock
	// ...

type ClockGuard
	// ...
```

**Resulting language**

```
language TFSM

type FSM
    container Transition transitions  [0..*]
    container State      states       [0..*]
    container Clock      clocks       [0..*]
    refers    State      initialState [1..1]  

type Transition
    refers State from   [1..1]
    refers State to     [1..1]
    refers Clock resets [0..*] // clocks to reset
	container ClockGuard guard [0..1]

type State
	container ClockGuard guards [0..1]

type Clock
	// ...

type ClockGuard
	// ...
```

**FSM Semantic example**

```
semantic package ExecutableFSM
import language FSM

semantic FSM:() => Void {
  	() => {
      self.currentState = self.init
      while(self.currentState != null) {
          // $ to show semantic translation
          // events is a collection of events inputs (runtime data)
          // head is a collection manipulation operation
          $(state)(self.events.head)
      }
  }
}

semantic State:(event:String) => Void {
  () => {
    self.fsm.currentState = self.event.filer[e | e.event == event].headOr(null)
  }
}
```

### Example 1: Mixing up FSM family instances

The following code is a model definition.

```
model A
import FSM as f
import HFSM as h
import TFSM as t

transition1 = h.Transition { ... }
transition2 = t.Transition { ... }

fsmModel = f.FSM {
    // should not typecheck since transitions1 and transition2 are not part of FSM
    transitions = [ transition1, transition2 ]
}
```



### Example 2: Lack of type detail at children level

```
semantic package ExecutableTFSM
import language TFSM

semantic FSM:() => Void {
  	// ... semantic definition ...
}modifications

semantic State:(event:String) => Void {

  () => {
    // since we are working at the TFSM level, even without Event explicit redefinition, every attributes of FSM.* should be copied as TFSM.* and be aware of the new elements intruduced during the TFSM language definition.
    self.fsm.currentState = self.event.filer[e | e.event == event && $(self.event.guard)()].headOr(null)
  }
}

semantic Clock:() => Boolean {
  () => {
    // ... semantic definition ...
  }
}
```



# Unstable ideas

## Tool variance

Should we find a way to define the type conformance of a tool to a language

For example a grammar can **produce** a model that is conform to its target language and all the languages it can conforms to (*covariance*).

But a checker can check any model that is conforms to it target language and all the languages that conforms to it (*contravariance*).
