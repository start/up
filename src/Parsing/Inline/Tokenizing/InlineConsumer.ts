import { NON_WHITESPACE_CHAR } from '../../../Patterns'
import { OnTextConsumerMatch } from './OnTextConsumerMatch'


export class InlineConsumer {
  textIndex = 0
  
  remainingText: string
  currentChar: string
  
  private isTouchingWordEnd: boolean

  constructor(private entireText: string) {  
    this.setTextIndex(0)
  }

  advanceTextIndex(length: number): void {
    this.setTextIndex(this.textIndex + length)
  }
  
  reachedEndOfText(): boolean {
    return this.textIndex >= this.entireText.length
  }

  advanceAfterMatch(args: { pattern: RegExp, then?: OnTextConsumerMatch }): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this.remainingText)

    if (!result) {
      return false
    }

    const [match, ...captures] = result

    const charAfterMatch = this.entireText[this.textIndex + match.length]
    const isTouchingWordStart = NON_WHITESPACE_CHAR_PATTERN.test(charAfterMatch)

    if (then) {
      then(match, this.isTouchingWordEnd, isTouchingWordStart, ...captures)
    }

    this.advanceTextIndex(match.length)

    return true
  }
  
  setTextIndex(countCharsConsumed: number): void {
    this.textIndex = countCharsConsumed
    this.updateComputedTextFields()
  }

  private updateComputedTextFields(): void {
    this.remainingText = this.entireText.substr(this.textIndex)
    this.currentChar = this.remainingText[0]

    const previousChar = this.entireText[this.textIndex - 1]
    this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar)
  }
}

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)
