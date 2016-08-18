We want our syntax node classes to be considered distinct by TypeScript's type system.

Unfortunately for us, TypeScript uses [structural typing](https://en.wikipedia.org/wiki/Structural_type_system), which means type compatibility is determined *only* by an object's structure.

To get around this, syntax node classes that would otherwise be considered equivalent are given a unique "anti-structural-typing" method.

These methods are:

1. Named in screaming case after their class (e.g. `EMPHASIS_NODE`)
2. Totally empty
3. Protected, because unused private methods are disallowed by the `noUnusedLocals` compiler option