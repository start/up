export abstract class Delimiter {
  constructor(
    public delimiterText: string,
    public remainingLength = delimiterText.length) { }

  get isFullySpent(): boolean {
    return this.remainingLength <= 0
  }

  pay(length: number): void {
    this.remainingLength -= length
  }
}
