import { NON_WHITESPACE_CHAR } from '../../../Patterns'
import { OnTextConsumerMatch } from './OnTextConsumerMatch'


export class Tokenizer {
  private textIndex = 0

  // These three fields are computed every time we updatae `textIndex`.
  private currentChar: string
  private remainingText: string
  private isTouchingWordEnd: boolean

  constructor(private entireText: string) {  
    this.updateComputedTextFields()
  }

  private updateComputedTextFields(): void {
    this.remainingText = this.entireText.substr(this.textIndex)
    this.currentChar = this.remainingText[0]

    const previousChar = this.entireText[this.textIndex - 1]
    this.isTouchingWordEnd = NON_WHITESPACE_CHAR_PATTERN.test(previousChar)
  }

  private advanceAfterMatch(args: { pattern: RegExp, then?: OnTextConsumerMatch }): boolean {
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

  private advanceTextIndex(length: number): void {
    this.textIndex += length
    this.updateComputedTextFields()
  }
}

const NON_WHITESPACE_CHAR_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)