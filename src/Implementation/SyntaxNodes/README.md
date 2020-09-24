We want our syntax node classes to be considered distinct by TypeScript's type system.

Unfortunately for us, TypeScript uses [structural typing](https://en.wikipedia.org/wiki/Structural_type_system), which means type compatibility is determined *only* by an object's structure.

To work around this, syntax node classes that would otherwise be considered equivalent are each given a unique "anti-structural-typing" field.

These field are:

1. Named in screaming case after their class (e.g. `EMPHASIS`) and their parent classes if there are any (e.g. `NUMBERED_LIST_ITEM`)
2. Set to undefined
3. Protected, because unused private fields are disallowed by the `noUnusedLocals` compiler option