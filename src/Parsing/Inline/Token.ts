export enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd,
  StressStart,
  StressEnd,
  InlineCode,
  InlineCodeStart,
  InlineCodeEnd,
  RevisionDeletionStart,
  RevisionDeletionEnd,
  SpoilerStart,
  SpoilerEnd,
  InlineAsideStart,
  InlineAsideEnd
}

export class Token {
  constructor(
    public meaning: TokenMeaning,
    public index: number,
    public value?: string) { }
}