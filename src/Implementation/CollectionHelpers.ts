// Returns the last item from `collection`.
export function last<T>(collection: T[]): T {
  return collection[collection.length - 1]
}

// Returns a single flattened array containing every item from every array in `collections`.
//
// The items' order is preserved.
export function concat<T>(collections: T[][]): T[] {
  return ([] as T[]).concat(...collections)
}

// Returns a reversed shallow copy of `collection`.
export function reversed<T>(collection: T[]): T[] {
  return collection.slice().reverse()
}

// Returns an array containing the distinct values in `values` using strict equality.
//
// The values' order is preserved.
export function distinct<T>(...values: T[]): T[] {
  return values.reduce((distinctValues, value) =>
    (distinctValues.indexOf(value) !== -1)
      ? distinctValues
      : distinctValues.concat([value])
    , [] as T[])
}
