import { NON_BLANK_PATTERN } from '../../Patterns'
import { OnMatch } from './OnMatch'


export class InlineTextConsumer {
  private _textIndex: number
  private _remainingText: string
  private _currentChar: string
  private _isTouchingWordEnd = false

  constructor(private entireText: string) {
    this.textIndex = 0
  }
  
  get textIndex(): number {
    return this._textIndex
  }
  
  set textIndex(value: number) {
    this._textIndex = value
    this.updateComputedTextFields()
  }
  
  get remainingText(): string {
    return this._remainingText
  }
  
  get currentChar(): string {
    return this._currentChar
  }
  
  get isTouchingWordEnd(): boolean {
    return this._isTouchingWordEnd
  }

  advanceTextIndex(length: number): void {
    this.textIndex += length
  }
  
  reachedEndOfText(): boolean {
    return this._textIndex >= this.entireText.length
  }

  advanceAfterMatch(args: { pattern: RegExp, then?: OnMatch }): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this._remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result

    const charAfterMatch = this.entireText[this._textIndex + match.length]
    
    // If the next character in the raw source text is non-whitespace, we consider the match to be touching the
    // beginning of a word. The next character can be anything, even be a backslash! We only care whether the
    // match appears to be touching the beginning of something.
    const isTouchingWordStart = NON_BLANK_PATTERN.test(charAfterMatch)

    if (then) {
      then(match, isTouchingWordStart, ...captures)
    }

    this.advanceTextIndex(match.length)

    return true
  }

  private updateComputedTextFields(): void {
    this._remainingText = this.entireText.substr(this._textIndex)
    this._currentChar = this._remainingText[0]

    const previousChar = this.entireText[this._textIndex - 1]
    
    // If the previous character in the raw source text was non-whitespace, we consider the current character to be
    // touching the end of a word. We don't care whether the previous character was escaped or not; we only care about
    // whether the current character appears to be touching the end of something.
    this._isTouchingWordEnd = NON_BLANK_PATTERN.test(previousChar)
  }
}
