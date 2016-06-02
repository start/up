import { NON_WHITESPACE_CHAR } from '../../../Patterns'
import { OnTextConsumerMatch } from './OnTextConsumerMatch'


export class InlineConsumer {
  countCharsConsumed = 0
  
  // These three fields are computed whenever we update `countCharsConsumed`
  remainingText: string
  currentChar: string
  private isTouchingWordEnd: boolean

  constructor(private entireText: string) {  
    this.updateComputedTextFields()
  }

  advanceTextIndex(length: number): void {
    this.countCharsConsumed += length
    this.updateComputedTextFields()
  }
  
  done(): boolean {
    return this.countCharsConsumed >= this.entireText.length
  }

  advanceAfterMatch(args: { pattern: RegExp, then?: OnTextConsumerMatch }): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this.remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result

    const charAfterMatch = this.entireText[this.countCharsConsumed + match.length]
    const isTouchingWordStart = NON_WHITESPACE_CHAR_PATTERN.test(charAfterMatch)

    if (then) {
      then(match, this.isTouchingWordEnd, isTouchingWordStart, ...captures)
    }

    this.advanceTextIndex(match.length)

    return true
  }

  private updateComputedTextFields(): void {
    this.remainingText = this.entireText.substr(this.countCharsConsumed)
    this.currentChar = this.remainingText[0]

    const previousChar = this.entireText[this.countCharsConsumed - 1]
    this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar)
  }
}

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)
