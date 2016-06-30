export interface OnTextMatch {
  (match: string, charAfterMatch: string, ...captures: string[]): void
}
