export class Sequence {
  constructor(public value: number) { }

  next(): number {
    return this.value++
  }
}