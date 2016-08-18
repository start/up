Pointless empty methods
-----------------------


We want our syntax node classes to be considered distinct by TypeScript's type system.

Unfortunately for us, TypeScript uses [structural typing](https://en.wikipedia.org/wiki/Structural_type_system), which means type compatibility is determined *only* by an object's structure.

To get around this, syntax node classes that would otherwise be considered equivalent are each given a unique "anti-structural-typing" method.

These methods are:

1. Named in screaming case after their class (e.g. `EMPHASIS_NODE`)
2. Totally empty
3. Protected, because unused private methods are disallowed by the `noUnusedLocals` compiler option


Inexplicably defaulting fields to `undefined` in constructor signatures
-----------------------------------------------------------------------

Up supports optional source mapping.

To support this, we require every outline syntax node class to offer a `sourceLineNumber`. This is acheived simply by having the `OutlineSyntaxNode` interface require the field.

However, even though `sourceLineNumber` is required, it should be optional in each constructor!

We indicate this with:

`````
constructor(
  [...]
  public sourceLineNumber: number = undefined
)
`````

... Because if we did the natural thing and instead used:


`````
constructor(
  [...]
  public sourceLineNumber?: number
)
`````

... TypeScript would complain that the field is optional, which is incompatible with `OutlineSyntaxNode`.
