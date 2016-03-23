export enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd,
  StressStart,
  StressEnd,
  InlineCode,
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