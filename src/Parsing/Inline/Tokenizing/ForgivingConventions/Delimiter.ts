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

  get canAffordMinorConvention(): boolean {
    return this.canAfford(MINOR_CONVENTION_COST)
  }

  get canAffordMajorConvention(): boolean {
    return this.canAfford(MAJOR_CONVENTION_COST)
  }

  get canOnlyAffordMinorConvention(): boolean {
    return this.canOnlyAfford(MINOR_CONVENTION_COST)
  }

  get canOnlyAffordMajorConvention(): boolean {
    return this.canOnlyAfford(MAJOR_CONVENTION_COST)
  }

  payForMinorInflection(): void {
    this.pay(MINOR_CONVENTION_COST)
  }

  payForMajorInflection(): void {
    this.pay(MAJOR_CONVENTION_COST)
  }

  cancelMutualUnspentLength(other: Delimiter): void {
    const commonUnspentLength = this.commonUnspentLength(other)

    this.pay(commonUnspentLength)
    other.pay(commonUnspentLength)
  }

  // TODO: Make private
  canAfford(cost: number): boolean {
    return this.unspentLength >= cost
  }

  // TODO: Make private
  canOnlyAfford(cost: number): boolean {
    return this.unspentLength === cost
  }

  // TODO: Make private
  pay(cost: number): void {
    this.unspentLength -= cost
  }

  // TODO: Remove
  commonUnspentLength(other: Delimiter): number {
    return Math.min(this.unspentLength, other.unspentLength)
  }
}

const MINOR_CONVENTION_COST = 1
const MAJOR_CONVENTION_COST = 2
