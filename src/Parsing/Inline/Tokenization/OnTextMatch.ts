export interface OnTextMatch {
  (match: string, matchPrecedesNonWhitespace: boolean, ...captures: string[]): void
}
