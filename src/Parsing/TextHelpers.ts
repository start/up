export function escapeForRegex(text: string): string {
  return text.replace(/[(){}[\].+*?^$\\|-]/g, '\\$&')
}