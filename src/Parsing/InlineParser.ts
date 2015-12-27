import { ParseResult } from './ParseResult'
import { ParentNodeClosureStatus } from './ParentNodeClosureStatus'
import { FailedParseResult } from './FailedParseResult'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'

interface SyntaxNodeType {
  new (): SyntaxNode
}

export class InlineParser {
  public result: ParseResult;

  private reachedEndOfParent: boolean;
  private parentFailedToParse: boolean;
  private resultNodes: SyntaxNode[];
  private workingText: string;
  private charIndex: number;

  constructor(
    private text: string,
    private parentNode: SyntaxNode,
    private parentNodeClosureStatus: ParentNodeClosureStatus,
    initialCharIndex = 0) {
    
    this.parentNode = parentNode
    this.parentNodeClosureStatus = parentNodeClosureStatus
    this.resultNodes = []
    this.workingText = ''
    this.reachedEndOfParent = false
    this.parentFailedToParse = false
    this.charIndex = 0

    let isNextCharEscaped = false

    for (this.charIndex = initialCharIndex; this.charIndex < text.length; this.charIndex += 1) {
      if (this.reachedEndOfParent || this.parentFailedToParse) {
        break;
      }

      let char = text[this.charIndex]

      if (isNextCharEscaped) {
        this.workingText += char
        isNextCharEscaped = false
        continue;
      }

      if (this.isCurrentText('\\')) {
        isNextCharEscaped = true
        continue;
      }

      if (this.isParent(InlineCodeNode)) {
        if (!this.closeParentIfCurrentTextIs('`')) {
          this.workingText += char
        }
        continue;
      }

      if (this.parseIfCurrentTextIs('`', InlineCodeNode)) {
        continue
      }

      if (this.isCurrentText('***') && !this.areAnyDistantAncestorsEither([EmphasisNode, StressNode])) {
        const emphasisFirstResult = this.getInlineParseResult(EmphasisNode, '*'.length)
        const stressFirstResult = this.getInlineParseResult(StressNode, '**'.length)
        
        if (this.tryAcceptLeastAmbiguousResult([emphasisFirstResult, stressFirstResult])) {
          continue;
        }
      }

      if (this.openOrCloseSandwichIfCurrentTextIs('**', StressNode)) {
        continue;
      }

      if (this.openOrCloseSandwichIfCurrentTextIs('*', EmphasisNode)) {
        continue;
      }

      this.workingText += char
    }

    if (this.parentFailedToParse || this.parentNodeClosureStatus === ParentNodeClosureStatus.MustBeClosed) {
      this.result = new FailedParseResult();
    } else {
      this.flushWorkingText()
      this.result = new ParseResult(this.resultNodes, this.charIndex, parentNode)
    }
  }
  private isParent(SyntaxNodeType: SyntaxNodeType): boolean {
    return this.parentNode instanceof SyntaxNodeType
  }

  private isParentEither(syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return this.isNodeEither(this.parentNode, syntaxNodeTypes)
  }

  private isNodeEither(node: SyntaxNode, syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return syntaxNodeTypes.some(SyntaxNodeType => node instanceof SyntaxNodeType)
  }

  private areAnyDistantAncestors(SyntaxNodeType: SyntaxNodeType): boolean {
    return this.parentNode.parents().some(ancestor => ancestor instanceof SyntaxNodeType)
  }

  private areAnyDistantAncestorsEither(syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return this.parentNode.parents()
      .some(ancestor => this.isNodeEither(ancestor, syntaxNodeTypes))
  }

  private isCurrentText(needle: string): boolean {
    return needle === this.text.substr(this.charIndex, needle.length)
  }

  private advanceCountExtraCharsConsumed(countCharsConsumed: number): void {
    this.charIndex += countCharsConsumed - 1
  }

  private flushWorkingText(): void {
    if (this.workingText) {
      this.resultNodes.push(new PlainTextNode(this.workingText))
    }
    this.workingText = ''
  }

  private tryParseInline(ParentSyntaxNodeType: SyntaxNodeType, countCharsThatOpenedNode: number): boolean {
    const parseResult = this.getInlineParseResult(ParentSyntaxNodeType, countCharsThatOpenedNode)

    if (parseResult.success()) {
      this.addParsedNode(parseResult)
      return true
    }

    return false
  }
  
  private getInlineParseResult(ParentSyntaxNodeType: SyntaxNodeType, countCharsThatOpenedNode: number): ParseResult {
    const newParentNode = new ParentSyntaxNodeType()
    newParentNode.parent = this.parentNode
    
    return new InlineParser(
      this.text.slice(this.charIndex),
      newParentNode,
      ParentNodeClosureStatus.MustBeClosed,
      countCharsThatOpenedNode
    ).result;
  }

  private addParsedNode(parseResult: ParseResult): void {
    this.flushWorkingText()
    parseResult.parentNode.addChildren(parseResult.nodes)
    this.resultNodes.push(parseResult.parentNode)
    this.advanceCountExtraCharsConsumed(parseResult.countCharsConsumed)
  }

  private closeParent(): void {
    this.flushWorkingText()
    this.parentNodeClosureStatus = ParentNodeClosureStatus.Closed
    this.reachedEndOfParent = true
  }

  private parseIfCurrentTextIs(needle: string, SyntaxNodeType: SyntaxNodeType): boolean {
    return this.isCurrentText(needle) && this.tryParseInline(SyntaxNodeType, needle.length)
  }

  private closeParentIfCurrentTextIs(needle: string) {
    if (this.isCurrentText(needle)) {
      this.closeParent()
      this.advanceCountExtraCharsConsumed(needle.length);
      return true;
    }

    return false;
  }

  private openOrCloseSandwichIfCurrentTextIs(bun: string, SandwichNodeType: SyntaxNodeType): boolean {
    if (!this.isCurrentText(bun)) {
      return false
    }

    if (this.isParent(SandwichNodeType)) {
      this.closeParent()
      this.advanceCountExtraCharsConsumed(bun.length)
      return true
    }

    if (this.tryParseInline(SandwichNodeType, bun.length)) {
      return true
    }

    return false
  }
  
  private tryAcceptLeastAmbiguousResult(parseResults: ParseResult[]): boolean {
    const acceptableResults = parseResults.filter((result) => result.success())
    
    if (acceptableResults.length === 0) {
      return false
    }

    parseResults.sort((r1, r2) => r2.countCharsConsumed - r1.countCharsConsumed)
    
    this.addParsedNode(parseResults[0])
    return true;
  }
}