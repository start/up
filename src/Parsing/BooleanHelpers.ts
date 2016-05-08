export function defaultTrue(value: boolean): boolean {
  return value || (value == null)
}