There are a couple of odd things about our syntax node classes.


Empty methods
=============

We want our syntax node classes to be considered distinct by TypeScript's type system.

Unfortunately for us, TypeScript uses [structural typing](https://en.wikipedia.org/wiki/Structural_type_system), which means type compatibility is determined *only* by an object's structure.

To work around this, syntax node classes that would otherwise be considered equivalent are each given a unique "anti-structural-typing" method.

These methods are:

1. Named in screaming case after their class (e.g. `EMPHASIS`) and their parent classes if there are any (e.g. `NUMBERED_LIST_ITEM`)
2. Totally empty
3. Protected, because unused private methods are disallowed by the `noUnusedLocals` compiler option


Defaulting optional class fields to `undefined`
===============================================

In short, we do this to ensure those fields always exist on their respective objects, which in turn makes some of our unit tests simpler to write.


The details
----------- 

Our syntax node constructors hide most of their optional fields in an optional `options` argument. If this argument is provided, we assign the optional fields.

Here's an example of one of those optional fields (`sourceLineNumber`):

``````
sourceLineNumber: number | undefined = undefined

constructor(children: OutlineSyntaxNode[], options?: { sourceLineNumber: number }) {
  super(children)

  if (options) {
    this.sourceLineNumber = options.sourceLineNumber
  }
}
``````

If we don't default `sourceLineNumber` to `undefined`, then `sourceLineNumber` would only exist on the object if `options` were provided.

This is actually in contrast to the typical TypeScript behavior. If we had declared `sourceLineNumber` directly in the constructor signature and made it optional, it would always be assigned (and thus part of the object).

``````
constructor(children: OutlineSyntaxNode[], public sourceLineNumber?: number) {
  super(children)
}
``````
