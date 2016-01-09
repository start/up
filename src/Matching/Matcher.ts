import { MatchResult } from './MatchResult'
import { FailedMatchResult } from './FailedMatchResult'

export class Matcher {
  public text: string;
  public index: number;
  private isCurrentCharEscaped = false;
  private countOpenParen = 0;
  private countOpenSquareBracket = 0;



  constructor(textOrMatcher: string | Matcher, implicitFirstMatch = '') {
    if (textOrMatcher instanceof Matcher) {
      this.text = textOrMatcher.remaining()
    } else {
      this.text = <string>textOrMatcher
    }

    this.index = implicitFirstMatch.length
    this.handleEscaping()
  }


  done(): boolean {
    return this.index >= this.text.length
  }


  match(needle: string): MatchResult {
    const success =
      !this.isCurrentCharEscaped && (needle === this.text.substr(this.index, needle.length)) && this.areRelevantBracketsClosed(needle)

    if (success) {
      return new MatchResult(this.index + needle.length, needle)
    }

    return new FailedMatchResult()
  }


  advanceBy(countOrResult: MatchResult | number): void {
    if (countOrResult instanceof MatchResult) {
      this.index = countOrResult.newIndex
    } else {
      this.index += <number>countOrResult
    }

    this.handleEscaping()
  }


  advance(): void {
    // Only non-escaped brackets that weren't part of some match should affect the opened/closed counts we're keeping.
    if (!this.isCurrentCharEscaped) {
      this.updateOpenBracketCounts()
    }

    this.index += 1
    this.handleEscaping()
  }


  countCharsAdvanced(): number {
    return this.index
  }


  countCharsAdvancedIncluding(result: MatchResult): number {
    return this.countCharsAdvanced() + result.matchedText.length
  }


  remaining(): string {
    return this.text.slice(this.index)
  }


  currentChar(): string {
    return this.text[this.index]
  }


  private handleEscaping() {
    this.isCurrentCharEscaped = false

    if (this.currentChar() === '\\') {
      this.index += 1
      this.isCurrentCharEscaped = true
    }
  }


  private updateOpenBracketCounts(): void {
    switch (this.currentChar()) {
      case '(':
        this.countOpenParen += 1
        break;
      case ')':
        this.countOpenParen = Math.max(0, this.countOpenParen - 1)
        break;
      case '[':
        this.countOpenSquareBracket += 1
        break;
      case ']':
        this.countOpenSquareBracket = Math.max(0, this.countOpenSquareBracket - 1)
        break;
    }
  }


  private areRelevantBracketsClosed(needle: string): boolean {
    return (
      (!this.countOpenSquareBracket || (countOf('[', needle) >= countOf(']', needle)))
      && (!this.countOpenParen || (countOf('(', needle) >= countOf(')', needle)))
    )
  }
}

function countOf(char: string, haystack: string): number {
  const matches: RegExpMatchArray = haystack.match(new RegExp(`\\${char}`, 'g')) || [];
  return matches.length
}