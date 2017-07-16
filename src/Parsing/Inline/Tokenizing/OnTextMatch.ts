export type OnTextMatch =
  (match: string, charAfterMatch: string, ...captures: string[]) => void
