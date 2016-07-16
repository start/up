export class InlineTextConsumer {
  private _remainingText: string
  private _textIndex: number
  private _currentChar: string
  private _previousChar: string

  constructor(private entireText: string) {
    this.textIndex = 0
  }

  get remainingText(): string {
    return this._remainingText
  }

  get textIndex(): number {
    return this._textIndex
  }

  set textIndex(value: number) {
    this._textIndex = value
    this.updateComputedTextFields()
  }

  get currentChar(): string {
    return this._currentChar
  }

  get previousChar(): string {
    return this._previousChar
  }

  advanceTextIndex(length: number): void {
    this.textIndex += length
  }

  done(): boolean {
    return this._textIndex >= this.entireText.length
  }

  consume(
    args: {
      pattern: RegExp,
      thenBeforeAdvancingTextIndex?: OnTextMatch
    }
  ): boolean {
    const { pattern, thenBeforeAdvancingTextIndex } = args

    const result = pattern.exec(this._remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result
    const charAfterMatch = this.entireText[this._textIndex + match.length]

    if (thenBeforeAdvancingTextIndex) {
      thenBeforeAdvancingTextIndex(match, charAfterMatch, ...captures)
    }

    this.advanceTextIndex(match.length)

    return true
  }

  private updateComputedTextFields(): void {
    this._remainingText = this.entireText.substr(this._textIndex)
    this._currentChar = this._remainingText[0]
    this._previousChar = this.entireText[this._textIndex - 1]
  }
}


export interface OnTextMatch {
  (match: string, charAfterMatch: string, ...captures: string[]): void
}
