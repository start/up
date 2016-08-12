// Returns the last item from `items`.
export function last<T>(items: T[]): T {
  return items[items.length - 1]
}

// Returns a single flattened array containing every item from every array in `collections`.
// The items' order is preserved.
export function concat<T>(collections: T[][]): T[] {
  return [].concat(...collections)
}

// Returns a reversed shallow copy of `items`. 
export function reversed<T>(items: T[]): T[] {
  return items.slice().reverse()
}

// Removes the last instance of `itemToRemove` from `items`.
export function remove<T>(items: T[], itemToRemove: T): void {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i] === itemToRemove) {
      items.splice(i, 1)
      return
    }
  }
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
