export interface onMatchBeforeConsumption {
  (lines: string[], remaining?: string, skip?: skipCountChars, reject?: rejectMatch): void
}

interface rejectMatch {
  (): void
}

interface skipCountChars {
  (count: number): void
}


export class LineConsumer {
  constructor(private text: string) {
  }
  
  consume(patterns: RegExp[], onMatchBeforeConsumption: onMatchBeforeConsumption): boolean {
    throw new Error("Not implemented")
  }
  
  consumeLine(onMatchBeforeConsumption: onMatchBeforeConsumption): boolean {
    throw new Error("Not implemented")
  }
}