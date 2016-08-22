Pointless empty methods
=======================

We want our syntax node classes to be considered distinct by TypeScript's type system.

Unfortunately for us, TypeScript uses [structural typing](https://en.wikipedia.org/wiki/Structural_type_system), which means type compatibility is determined *only* by an object's structure.

To work around this, syntax node classes that would otherwise be considered equivalent are each given a unique "anti-structural-typing" method.

These methods are:

1. Named in screaming case after their class (e.g. `EMPHASIS`) and their parent classes if there are any (e.g. `ORDERED_LIST ITEM`)
2. Totally empty
3. Protected, because unused private methods are disallowed by the `noUnusedLocals` compiler option


Bizarrely defaulting optional class fields to `undefined`
=========================================================

In short, we do this to ensure those fields always exist on their respective objects.

This mimics the default TypeScript behavior, which in turn makes a few unit tests simpler to write.


The details
----------- 

Our syntax node constructors hide their optional fields in an `options` argument. If this argument is provided, we assign the optional fields.

Here's an example of one of those optional fields (`ordinal`):

``````
public ordinal: number = undefined

constructor(public children: OutlineSyntaxNode[], options?: { ordinal: number }) {
  super(children)

  if (options) {
    this.ordinal = options.ordinal
  }
}
``````

If we don't default `ordinal` to `undefined`, then *the `ordinal` field would only exist on the object if `options` were provided.*

This is in contrast to the typical TypeScript behavior. If we had declared `ordinal` directly in the constructor signature and made it optional, it's always assigned.

``````
constructor(public children: OutlineSyntaxNode[], public ordinal?: number) {
  super(children)
}
``````

In the above example, TypeScript emits JavaScript to *always* set `this.ordinal` to the `ordinal` argument, even when the argument not provided.
