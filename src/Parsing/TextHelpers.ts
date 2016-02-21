export function applyBackslashEscaping(text: string) {
  return text.replace(/\\(.?)/g, '$1')
}
