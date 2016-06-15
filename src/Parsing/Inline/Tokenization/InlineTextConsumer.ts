import { NON_BLANK_PATTERN } from '../../../Patterns'
import { OnMatch } from './OnMatch'


export class InlineTextConsumer {
  private _textIndex: number
  private _remainingText: string
  private _currentChar: string
  private _isFollowingNonWhitespace = false

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

  get isFollowingNonWhitespace(): boolean {
    return this._isFollowingNonWhitespace
  }

  advanceTextIndex(length: number): void {
    this.textIndex += length
  }

  reachedEndOfText(): boolean {
    return this._textIndex >= this.entireText.length
  }

  consume(
    args: {
      pattern: RegExp,
      thenBeforeAdvancingTextIndex?: OnMatch
    }
  ): boolean {
    const { pattern, thenBeforeAdvancingTextIndex } = args

    const result = pattern.exec(this._remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result

    const charAfterMatch = this.entireText[this._textIndex + match.length]
    const matchPrecedesNonWhitespace = NON_BLANK_PATTERN.test(charAfterMatch)

    if (thenBeforeAdvancingTextIndex) {
      thenBeforeAdvancingTextIndex(match, matchPrecedesNonWhitespace, ...captures)
    }

    this.advanceTextIndex(match.length)

    return true
  }

  private updateComputedTextFields(): void {
    this._remainingText = this.entireText.substr(this._textIndex)
    this._currentChar = this._remainingText[0]

    const previousChar = this.entireText[this._textIndex - 1] 
    this._isFollowingNonWhitespace = (previousChar && NON_BLANK_PATTERN.test(previousChar))
  }
}
