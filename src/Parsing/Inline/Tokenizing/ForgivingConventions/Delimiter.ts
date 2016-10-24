export abstract class Delimiter {
  constructor(
    public delimiterText: string,
    public unspentLength = delimiterText.length) { }

  get isTotallySpent(): boolean {
    return this.unspentLength === 0
  }

  canAfford(cost: number): boolean {
    return this.unspentLength >= cost
  }

  canOnlyAfford(cost: number): boolean {
    return this.unspentLength === cost
  }

  pay(cost: number): void {
    this.unspentLength -= cost
  }

  commonUnspentLength(other: Delimiter): number {
    return Math.min(this.unspentLength, other.unspentLength)
  }
}
