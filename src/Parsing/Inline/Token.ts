export enum TokenMeaning {
  Text,
  EmphasisStart,
  EmphasisEnd,
}

export class Token {
  constructor(
    public meaning: TokenMeaning,
    public index: number,
    public value: string) { }
}