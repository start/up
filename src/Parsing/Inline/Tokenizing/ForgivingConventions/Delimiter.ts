export abstract class Delimiter {
  constructor(
    public delimiterText: string,
    public unspentLength = delimiterText.length) { }

  get isFullySpent(): boolean {
    return this.unspentLength <= 0
  }

  pay(cost: number): void {
    this.unspentLength -= cost
  }
}
