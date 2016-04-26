interface ConsumeLineArgs {
  pattern?: RegExp,
  if?: ShouldConsumeLine,
  then?: OnConsume
}

interface ShouldConsumeLine {
  (line: string, ...captures: string[]): boolean
}

interface OnConsume {
  (text: string, ...captures: string[]): void
}


export class OutlineTextConsumer {
  private index = 0;

  constructor(private text: string) { }

  done(): boolean {
    return this.index >= this.text.length
  }

  consumeLine(args: ConsumeLineArgs): boolean {
    if (this.done()) {
      return false
    }

    let line: string
    
    for (let i = this.index; i < this.text.length; i++) {
      const char = this.text[i]
      
      // Escaped line breaks don't end lines. If the current char is a backslash, let's just skip the next one.
      if (char === '\\') {
        i++
        continue
      }
      
      if (char === '\n') {
        line = this.text.substring(this.index, i)
      }
    }
    
    if (!line) {
      line = this.remainingText()
    }

    let captures: string[] = []

    if (args.pattern) {
      const results = args.pattern.exec(line)

      if (!results) {
        return false
      }

      captures = results.slice(1)
    }

    if (args.if && !args.if(line, ...captures)) {
      return false
    }

    this.advance(line.length)

    if (args.then) {
      args.then(line, ...captures)
    }

    return true
  }

  advance(count: number): void {
    this.index += count
  }

  lengthConsumed(): number {
    return this.index
  }

  remainingText(): string {
    return this.text.slice(this.index)
  }
}
