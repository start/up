export function last<T>(items: T[]): T {
  return items[items.length - 1]
}

export function concat<T>(collections: T[][]): T[] {
  return [].concat([], ...collections)
}

export function reversed<T>(items: T[]): T[] {
  return items.slice().reverse()
}

export function remove<T>(items: T[], itemToRemove: T): void {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === itemToRemove) {
      items.splice(i, 1)
      return
    }
  }
}
