import { Token } from './Tokens/Token'
import { SpoilerStartToken } from './Tokens/SpoilerStartToken'
import { RevisionInsertionStartToken } from './Tokens/RevisionInsertionStartToken'
import { RevisionDeletionStartToken } from './Tokens/RevisionDeletionStartToken'
import { FootnoteStartToken } from './Tokens/FootnoteStartToken'
import { RichConvention } from './RichConvention'
import { TokenizerState } from './TokenizerState'

export class TokenizerContext {
  constructor(
    public state: TokenizerState,
    public textIndex: number,
    public countTokens: number,
    public collectedUnmatchedText: string) { }
}


const NOT_WHITESPACE_PATTERN = /\S/

// TODO: Explain why this class is separate from `Tokenizer`
// TODO: Refactor tons of duplicate functionality

// For now, emphasis and stress aren't determined until after tokenization, so we don't
// need to worry about keeping track of them here.

export class OldTokenizerContext {
  public isInlineCodeOpen = false
  public isLinkOpen = false
  public isRevisionDeletionOpen = false
  public isRevisionInsertionOpen = false
  public countSpoilersOpen = 0
  public countFootnotesOpen = 0

  public initialToken: Token

  public lengthAdvanced = 0

  // Tthe following fields are re-computed in `dirty()` based on `lengthAdvanced`.
  public remainingText: string
  public currentChar: string
  public isTouchingEndOfWord: boolean

  constructor(private entireText: string, private initialIndex = 0) {
    this.dirty()
  }

  match(args: MatchArgs): boolean {
    const { pattern, then } = args

    const result = pattern.exec(this.remainingText)

    if (!result) {
      return false
    }

    const match = result[0]
    const captures = result.slice(1)

    const isTouchingWordEnd = this.isTouchingEndOfWord

    const charAfterMatch = this.entireText[this.currentIndex() + match.length]
    const isTouchingWordStart = NOT_WHITESPACE_PATTERN.test(charAfterMatch)

    if (then) {
      then(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
    }

    return true
  }

  advanceIfMatch(args: MatchArgs): boolean {
    let originalThen = args.then || (() => { })

    return this.match({
      pattern: args.pattern,

      then: (match, isTouchingWordEnd, isTouchingWordStart, ...captures) => {
        this.advance(match.length)
        originalThen(match, isTouchingWordEnd, isTouchingWordStart, ...captures)
      }
    })
  }

  done(): boolean {
    return !this.remainingText
  }

  failed(): boolean {
    return (
      this.isInlineCodeOpen
      || this.isLinkOpen
      || this.isRevisionDeletionOpen
      || this.isRevisionInsertionOpen
      || this.countSpoilersOpen > 0
      || this.countFootnotesOpen > 0
    )
  }

  withInlineCodeOpen(): OldTokenizerContext {
    const copy = this.copyForNewOpenConvention()

    copy.isInlineCodeOpen = true

    return copy
  }

  withLinkOpen(): OldTokenizerContext {
    const copy = this.copyForNewOpenConvention()

    copy.isLinkOpen = true

    return copy
  }

  withRevisionDeletionOpen(): OldTokenizerContext {
    const copy = this.copyForNewOpenConvention()

    copy.isRevisionDeletionOpen = true
    copy.initialToken = new RevisionDeletionStartToken()

    return copy
  }

  withRevisionInsertionOpen(): OldTokenizerContext {
    const copy = this.copyForNewOpenConvention()

    copy.isRevisionInsertionOpen = true
    copy.initialToken = new RevisionInsertionStartToken()

    return copy
  }

  withAdditionalSpoilerOpen(): OldTokenizerContext {
    const copy = this.copyForNewOpenConvention()

    copy.countSpoilersOpen += 1
    copy.initialToken = new SpoilerStartToken()

    return copy
  }

  withAdditionalFootnoteOpen(): OldTokenizerContext {
    const copy = this.copyForNewOpenConvention()

    copy.countFootnotesOpen += 1
    copy.initialToken = new FootnoteStartToken()

    return copy
  }

  closeInlineCode(): void {
    this.isInlineCodeOpen = false
  }

  closeLink(): void {
    this.isLinkOpen = false
  }

  closeRevisionDeletion(): void {
    this.isRevisionDeletionOpen = false
  }

  closeRevisionInsertion(): void {
    this.isRevisionInsertionOpen = false
  }

  closeSpoiler(): void {
    this.countSpoilersOpen -= 1
  }

  closeFootnote(): void {
    this.countFootnotesOpen -= 1
  }

  advance(length: number): void {
    this.lengthAdvanced += length
    this.dirty()
  }

  isSpoilerInnermostOpenConvention(): boolean {
    return this.initialToken instanceof SpoilerStartToken
  }

  isFootnoteInnermostOpenConvention(): boolean {
    return this.initialToken instanceof FootnoteStartToken
  }

  private currentIndex(): number {
    return this.initialIndex + this.lengthAdvanced
  }

  private copyForNewOpenConvention(): OldTokenizerContext {
    const copy = new OldTokenizerContext(this.entireText, this.currentIndex())

    copy.isLinkOpen = this.isLinkOpen
    copy.isRevisionDeletionOpen = this.isRevisionDeletionOpen
    copy.isRevisionInsertionOpen = this.isRevisionInsertionOpen
    copy.countSpoilersOpen = this.countSpoilersOpen
    copy.countFootnotesOpen = this.countFootnotesOpen
    copy.isInlineCodeOpen = this.isInlineCodeOpen

    copy.dirty()
    return copy
  }

  private dirty(): void {
    this.remainingText = this.entireText.substr(this.currentIndex())
    this.currentChar = this.remainingText[0]

    const previousChar = this.entireText[this.currentIndex() - 1]
    this.isTouchingEndOfWord = NOT_WHITESPACE_PATTERN.test(previousChar)
  }
}

interface MatchArgs {
  pattern: RegExp,
  then?: OnMatch
}

interface OnMatch {
  (match: string, isTouchingWordEnd: boolean, isTouchingWordStart: boolean, ...captures: string[]): void
}