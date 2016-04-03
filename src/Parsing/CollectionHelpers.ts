export function last<T>(items: T[]): T {
  return items[items.length - 1]
}

export function swap<T>(items: T[], firstIndex: number, secondIndex: number): void {
  const firstItem = items[firstIndex]
  
  items[firstIndex] = items[secondIndex]
  items[secondIndex] = firstItem
}