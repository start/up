// This class helps incrementally consume text using regular expression patterns.
export class TextConsumer {
  private _remaining: string
  private _index: number
  private _currentChar: string
  private _previousChar: string

  constructor(private entireText: string) {
    this.index = 0
  }

  get remaining(): string {
    return this._remaining
  }

  get index(): number {
    return this._index
  }

  set index(value: number) {
    this._index = value
    this.updateComputedTextFields()
  }

  get currentChar(): string {
    return this._currentChar
  }

  get previousChar(): string {
    return this._previousChar
  }

  done(): boolean {
    return this._index >= this.entireText.length
  }

  // This method consumes any text from the start of `remaining` if it matches `pattern`.
  //
  // Before actually consuming the text, `thenBeforeConsumingText` is invoked.
  //
  // NOTE: This method assumes `pattern` only matches the beginning of a string!  
  consume(
    args: {
      pattern: RegExp
      thenBeforeConsumingText?: OnTextMatch
    }
  ): boolean {
    const { pattern, thenBeforeConsumingText } = args
    const result = pattern.exec(this._remaining)

    if (!result) {
      return false
    }

    const [match, ...captures] = result
    const charAfterMatch = this.entireText[this._index + match.length]

    if (thenBeforeConsumingText) {
      thenBeforeConsumingText(match, charAfterMatch, ...captures)
    }

    this.index += match.length
    return true
  }

  private updateComputedTextFields(): void {
    this._remaining = this.entireText.substr(this._index)
    this._currentChar = this._remaining[0]
    this._previousChar = this.entireText[this._index - 1]
  }
}


export interface OnTextMatch {
  (match: string, charAfterMatch: string, ...captures: string[]): void
}
