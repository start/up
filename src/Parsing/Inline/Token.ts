export enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd,
  RevisionDeletionStart,
  RevisionDeletionEnd,
}

export class Token {
  constructor(
    public meaning: TokenMeaning,
    public index: number,
    public value: string) { }
}