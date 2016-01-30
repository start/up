import { LinePattern } from './LinePattern'

interface onMatch {
  (...lines: string[]): void
}

export class OutlineConvention {
  constructor(public linePatterns: LinePattern[], public onMatch: onMatch) { }
}