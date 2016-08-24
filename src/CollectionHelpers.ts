// Returns the last item from `collection`.
export function last<T>(collection: T[]): T {
  return collection[collection.length - 1]
}

// Returns a single flattened array containing every item from every array in `collections`.
// The items' order is preserved.
export function concat<T>(collections: T[][]): T[] {
  return [].concat(...collections)
}

// Returns a reversed shallow copy of `collection`. 
export function reversed<T>(collection: T[]): T[] {
  return collection.slice().reverse()
}

// Removes the last instance of `itemToRemove` from `collection`.
export function remove<T>(collection: T[], itemToRemove: T): void {
  for (let i = collection.length - 1; i >= 0; i--) {
    if (collection[i] === itemToRemove) {
      collection.splice(i, 1)
      return
    }
  }
}

// Returns the distinct items from `items`. The items' order is preserved. 
export function distinct<T>(collection: T[]): T[] {
  return collection.reduce((distinctItems, item) =>
    (distinctItems.indexOf(item) !== -1)
      ? distinctItems
      : distinctItems.concat([item])
    , [])
}

// Returns the first non-null value in `values`, if one exists. Otherwise, returns null.
export function coalesce<T>(...values: T[]): T {
  for (const value of values) {
    if (value != null) {
      return value
    }
  }

  return null
}
