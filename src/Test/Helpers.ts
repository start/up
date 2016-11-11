// Casts `value` to type `T`.
export function cast<T>(value: any): T {
  return value as T
}