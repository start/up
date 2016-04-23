// TODO: Move this file

export function last<T>(items: T[]): T {
  return items[items.length - 1]
}

export function lastChar(text: string): string {
  return text[text.length - 1]
}

export function swap<T>(items: T[], firstIndex: number, secondIndex: number): void {
  const firstItem = items[firstIndex]
  
  items[firstIndex] = items[secondIndex]
  items[secondIndex] = firstItem
}

export function concat<T>(collections: T[][]): T[] {
  return [].concat([], ...collections)
}