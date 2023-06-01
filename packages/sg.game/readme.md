# Solar Genesis

## Notes

### Adding a new Page

1. Create a file in `source/modules` for your page content
2. Add an entry to the `Pages` enum in `source/Controller.ts`
3. Add your page component to the switch statement of `selectPageComponent` in `source/modules/Frame.tsx`

### Adding a new Object

1. Create a new module file in `source/objects`.
2. Add an interface called `IClassName` in this file. Be sure that this interface meets the IPhotonObject protocol
    1. The object must not have direct references to game objects
    2. The object must be acyclic
    3. Special "numbers" like NaN and Infinity are handled by the serialization algo
    4. Dates are handled by the serialization algo.
    5. Keep this object simple and as small as possible!
3. Add a class called `ClassName` that implements both `IClassName` __and__ `IPhotonObject<IClassName>`
4. Implement the interfaces.