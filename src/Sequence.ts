export class Sequence {
  private value: number

  constructor(args: { startingAt: number }) {
    this.value = args.startingAt
  }

  next(): number {
    return this.value++
  }
}