export enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd,
  StressStart,
  StressEnd,
  InlineCodeStart,
  InlineCodeEnd,
  RevisionDeletionStart,
  RevisionDeletionEnd,
  SpoilerStart,
  SpoilerEnd
}

export class Token {
  constructor(
    public meaning: TokenMeaning,
    public index: number,
    public value?: string) { }
}