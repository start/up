export function last<T>(items: T[]): T {
  return items[items.length - 1]
}

export function swap<T>(items: T[], index1: number, index2: number): void {
  const firstItem = items[index1]
  
  items[index1] = items[index2]
  items[index2] = firstItem
}

export function concat<T>(collections: T[][]): T[] {
  return [].concat([], ...collections)
}

export function contains<T>(items: T[], item: T): boolean {
  return (items.indexOf(item) !== -1)
}

export function reversed<T>(items: T[]): T[] {
  return items.slice().reverse()
}