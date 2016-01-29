
interface onMatch {
  (...lines: string[]): void
}

export class OutlineConvention {
  constructor(public linePatterns: string[], public onMatch: onMatch) { }
}