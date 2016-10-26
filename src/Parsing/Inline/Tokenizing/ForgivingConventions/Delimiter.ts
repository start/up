export abstract class Delimiter {
  constructor(
    public delimiterText: string,
    public unspentLength = delimiterText.length) { }

  get isTotallySpent(): boolean {
    return this.unspentLength <= 0
  }

  pay(cost: number): void {
    this.unspentLength -= cost
  }

  commonUnspentLength(other: Delimiter): number {
    return Math.min(this.unspentLength, other.unspentLength)
  }
}
