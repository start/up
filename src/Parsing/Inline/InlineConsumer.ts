import { NON_WHITESPACE_CHAR } from '../../Patterns'
import { OnTextConsumerMatch } from './OnTextConsumerMatch'


export class InlineConsumer {
  private _textIndex = 0
  private _remainingText: string
  private _currentChar: string
  private isTouchingWordEnd: boolean

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

  advanceTextIndex(length: number): void {
    this.textIndex += length
  }
  
  reachedEndOfText(): boolean {
    return this._textIndex >= this.entireText.length
  }

  advanceAfterMatch(args: { pattern: RegExp, then?: OnTextConsumerMatch }): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this._remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result

    const charAfterMatch = this.entireText[this._textIndex + match.length]
    const isTouchingWordStart = NON_WHITESPACE_CHAR_PATTERN.test(charAfterMatch)

    if (then) {
      then(match, this.isTouchingWordEnd, isTouchingWordStart, ...captures)
    }

    this.advanceTextIndex(match.length)

    return true
  }

  private updateComputedTextFields(): void {
    this._remainingText = this.entireText.substr(this._textIndex)
    this._currentChar = this._remainingText[0]

    const previousChar = this.entireText[this._textIndex - 1]
    this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar)
  }
}

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)
