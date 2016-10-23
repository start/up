export class Delimiter {
  constructor(
    public delimiterText: string,
    public unspentLength = delimiterText.length) { }

  canAfford(cost: number): boolean {
    return this.unspentLength >= cost
  }

  canOnlyAfford(cost: number): boolean {
    return this.unspentLength === cost
  }

  pay(cost: number): void {
    this.unspentLength -= cost
  }

  isFullySpent(): boolean {
    return this.unspentLength === 0
  }

  commonUnspentLength(other: Delimiter): number {
    return Math.min(this.unspentLength, other.unspentLength)
  }
}
