// This class helps incrementally consume text using regular expression patterns.
export class TextConsumer {
  // These are all indirectly set in the constructor
  private _index!: number
  private _remaining!: string
  private _currentChar!: string
  private _previousChar!: string

  constructor(private entireText: string) {
    this.setIndex(0)
  }

  setIndex(newIndex: number) {
    this._index = newIndex
    this._remaining = this.entireText.substr(newIndex)
    this._currentChar = this._remaining[0]
    this._previousChar = this.entireText[newIndex - 1]
  }

  index(): number {
    return this._index
  }

  advance(by: number): void {
    this.setIndex(this._index + by)
  }

  remaining(): string {
    return this._remaining
  }

  currentChar(): string {
    return this._currentChar
  }

  previousChar(): string {
    return this._previousChar
  }

  done(): boolean {
    return this._index >= this.entireText.length
  }

  // This method consumes any text from the start of `remaining` if it matches `pattern`.
  //
  // NOTE: We assume `pattern` is anchored to the beginning of the input string!
  consume(pattern: RegExp): null | {
    match: string
    charAfterMatch: string
    captures: string[]
  } {
    const result = pattern.exec(this._remaining)

    if (!result) {
      return null
    }

    const [match, ...captures] = result
    const charAfterMatch = this.entireText[this._index + match.length]

    this.advance(match.length)

    return { match, charAfterMatch, captures }
  }
}
