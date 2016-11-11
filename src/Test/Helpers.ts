// Coerces `value` to type T.
export function coerce<T>(value: any): T {
  return value as T
}