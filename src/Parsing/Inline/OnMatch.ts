export interface OnMatch {
  (match: string, matchPrecedesNonWhitespace: boolean, ...captures: string[]): void
}
