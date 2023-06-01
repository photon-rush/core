# Photon Programming Language

The Photon language is a general purpose, strongly typed programming language. It also includes a serialization format and a fully featured standard library.

Photon programs are organized in to modules that consist of types, operators, functions and the statements and properties that comprise them.


## Definitions

- _Record_     - A record is an immutable data structure, ultimately, everything in a Photon program is a record.
- _Type_       - A Type defines the shape of a record. The Photon compiler will create and infer types automatically (where possible), but they can also be explicitly defined in terms of properties and in terms of other types.
- _Property_   - A Property is always part of a type. It has a type as well.
- _Operator_   - An Operator defines an operation that can be done to a record of a specific type. Operators can be unary or binary. Operators are defined on a Type, and like functions, they can be overloaded.
- _Function_   - A function takes any number of typed parameters and always returns a single record of a specific type.
- _Collection_ - A Collection is a special kind of record that holds an ordered, dynamic, iterable collection of records that are accessible by index. Collections can be heterogenous and are defined using generics.
- _Map_        - A Map is a special kind of record that holds a dynamic, iterable collection of records addressable by a key. Map values can be heterogenous, but all keys are of type String.


## Examples

### Type

This creates a type called Photon with two properties (x and y) of type Number. Types are declared with the type keyword.

```photon
type Point {
    x: Number,
    y: Number,
}
```

### Operator

```photon
type Point {
    x: Number,
    y: Number,

    operator add(point: Point): Point {
        return {
            x: this.x + point.x,
            y: this.y + point.y,
        };
    }
}
