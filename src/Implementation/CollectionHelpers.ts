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

// Returns the first non-null value in `values`. If `values` does not contain a
// non-null value, this function throws an exception.
export function coalesce<T>(...values: Array<T | undefined>): T {
  for (const value of values) {
    if (value != null) {
      return value
    }
  }

  throw new Error('Every value in `values` was null.')
}
