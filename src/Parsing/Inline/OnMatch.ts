export interface OnMatch {
  (match: string, ...captures: string[]): void
}
