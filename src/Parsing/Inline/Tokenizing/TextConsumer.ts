import { NON_WHITESPACE_CHAR } from '../../../Patterns'
import { OnTextConsumerMatch } from './OnTextConsumerMatch'


export class TextConsumer {
  lengthConsumed = 0
  
  // These three fields are computed whenever we update `lengthConsumed`
  remainingText: string
  currentChar: string
  private isTouchingWordEnd: boolean

  constructor(private entireText: string) {  
    this.updateComputedTextFields()
  }

  advanceTextIndex(length: number): void {
    this.lengthConsumed += length
    this.updateComputedTextFields()
  }
  
  done(): boolean {
    return this.lengthConsumed >= this.entireText.length
  }

  private updateComputedTextFields(): void {
    this.remainingText = this.entireText.substr(this.lengthConsumed)
    this.currentChar = this.remainingText[0]

    const previousChar = this.entireText[this.lengthConsumed - 1]
    this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar)
  }

  private advanceAfterMatch(args: { pattern: RegExp, then?: OnTextConsumerMatch }): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this.remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result

    const charAfterMatch = this.entireText[this.lengthConsumed + match.length]
    const isTouchingWordStart = NON_WHITESPACE_CHAR_PATTERN.test(charAfterMatch)

    if (then) {
      then(match, this.isTouchingWordEnd, isTouchingWordStart, ...captures)
    }

    this.advanceTextIndex(match.length)

    return true
  }
}

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)