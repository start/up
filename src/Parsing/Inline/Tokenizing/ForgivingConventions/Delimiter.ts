export class Delimiter {
  constructor(
    public delimiterText: string,
    public unspentLength = delimiterText.length) { }

  get isTotallySpent(): boolean {
    return this.unspentLength === 0
  }

  get isTotallyUnspent(): boolean {
    return this.unspentLength === this.delimiterText.length
  }

  canAfford(length: number): boolean {
    return this.unspentLength >= length
  }

  canOnlyAfford(length: number): boolean {
    return this.unspentLength === length
  }

  pay(length: number): void {
    this.unspentLength -= length
  }

  commonUnspentLength(other: Delimiter): number {
    return Math.min(this.unspentLength, other.unspentLength)
  }
}
