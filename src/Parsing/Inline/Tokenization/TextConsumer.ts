export class TextConsumer {
  private _remaining: string
  private _textIndex: number
  private _currentChar: string
  private _previousChar: string

  constructor(private entireText: string) {
    this.index = 0
  }

  get remaining(): string {
    return this._remaining
  }

  get index(): number {
    return this._textIndex
  }

  set index(value: number) {
    this._textIndex = value
    this.updateComputedTextFields()
  }

  get currentChar(): string {
    return this._currentChar
  }

  get previousChar(): string {
    return this._previousChar
  }

  done(): boolean {
    return this._textIndex >= this.entireText.length
  }

  consume(
    args: {
      pattern: RegExp
      thenBeforeAdvancingTextIndex?: OnTextMatch
    }
  ): boolean {
    const { pattern, thenBeforeAdvancingTextIndex } = args
    const result = pattern.exec(this._remaining)

    if (!result) {
      return false
    }

    const [match, ...captures] = result
    const charAfterMatch = this.entireText[this._textIndex + match.length]

    if (thenBeforeAdvancingTextIndex) {
      thenBeforeAdvancingTextIndex(match, charAfterMatch, ...captures)
    }

    this.index += match.length
    return true
  }

  private updateComputedTextFields(): void {
    this._remaining = this.entireText.substr(this._textIndex)
    this._currentChar = this._remaining[0]
    this._previousChar = this.entireText[this._textIndex - 1]
  }
}


export interface OnTextMatch {
  (match: string, charAfterMatch: string, ...captures: string[]): void
}
