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

  constructor(private text: string, private parentNode: SyntaxNode, private parentNodeClosureStatus: ParentNodeClosureStatus) {
    this.parentNode = parentNode
    this.parentNodeClosureStatus = parentNodeClosureStatus
    this.resultNodes = []
    this.workingText = ''
    this.reachedEndOfParent = false
    this.parentFailedToParse = false
    this.charIndex = 0

    let isNextCharEscaped = false

    for (this.charIndex = 0; this.charIndex < text.length; this.charIndex += 1) {
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
        // TODO
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
      this.addParsedNode(parseResult.parentNode, parseResult, countCharsThatOpenedNode)
      return true
    }

    return false
  }
  
  private getInlineParseResult(ParentSyntaxNodeType: SyntaxNodeType, countCharsThatOpenedNode: number): ParseResult {
    const newParentNode = new ParentSyntaxNodeType();
    newParentNode.parent = this.parentNode

    const startIndex = this.charIndex + countCharsThatOpenedNode
    return new InlineParser(this.text.slice(startIndex), newParentNode, ParentNodeClosureStatus.MustBeClosed).result;
  }

  private addParsedNode(node: SyntaxNode, parseResult: ParseResult, countCharsThatOpenedNode: number): void {
    this.flushWorkingText()
    node.addChildren(parseResult.nodes)
    this.resultNodes.push(node)
    this.advanceCountExtraCharsConsumed(countCharsThatOpenedNode + parseResult.countCharsConsumed)
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
    
    // If we're indirectly nested inside a node of this type, we can't reognize this bun as its end
    // just yet, because we'd be leaving the innermost nodes dangling. So we fail the current
    // (innermost) node, which lets the parser try again (likely interpreting the opening of the
    // dangling node as plain text.
    if (this.areAnyDistantAncestors(SandwichNodeType)) {
      this.parentFailedToParse = true;
      return false
    }

    if (this.tryParseInline(SandwichNodeType, bun.length)) {
      return true
    }

    return false
  }
}