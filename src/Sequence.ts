export class Sequence {
  private value: number

  constructor(args: { startingWith: number }) {
    this.value = args.startingWith
  }

  next(): number {
    return this.value++
  }
}