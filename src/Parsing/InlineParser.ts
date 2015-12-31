import { ParseResult } from './ParseResult'
import { ParentNodeClosureStatus } from './ParentNodeClosureStatus'
import { InlineSandwich } from './InlineSandwich'
import { SyntaxNodeType } from './SyntaxNodeType'
import { FailedParseResult } from './FailedParseResult'

import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'
import { LinkNode } from '../SyntaxNodes/LinkNode'

const INLINE_CODE = new InlineSandwich(InlineCodeNode, '`')
const STRESS = new InlineSandwich(StressNode, "**")
const EMPHASIS = new InlineSandwich(EmphasisNode, "*")
const REVISION_INSERTION = new InlineSandwich(RevisionInsertionNode, "++")
const REVISION_DELETION = new InlineSandwich(RevisionDeletionNode, "~~")
const SPOILER = new InlineSandwich(SpoilerNode, "[<_<]", "[>_>]")

export class InlineParser {
  public result: ParseResult;

  private reachedEndOfParent = false;
  private parentFailedToParse = false;
  private resultNodes: SyntaxNode[] = [];
  private workingPlainText = '';
  private charIndex: number;
  private countUnclosedParens = 0;
  private countUnclosedSquareBrackes = 0;

  constructor(
    private text: string,
    private parentNode: SyntaxNode,
    private parentNodeClosureStatus: ParentNodeClosureStatus,
    countCharsConsumedOpeningParentNode = 0) {

    let isNextCharEscaped = false
    let isParsingLinkUrl = false

    main_parser_loop:
    for (this.charIndex = countCharsConsumedOpeningParentNode; this.charIndex < text.length; this.charIndex += 1) {
      if (this.reachedEndOfParent || this.parentFailedToParse) {
        break;
      }

      let char = text[this.charIndex]

      if (isNextCharEscaped) {
        this.workingPlainText += char
        isNextCharEscaped = false
        continue;
      }

      if (this.isMatch('\\')) {
        isNextCharEscaped = true
        continue;
      }

      if (this.tryOpenOrCloseSandwich(INLINE_CODE)) {
        continue;
      }

      if (this.isParent(InlineCodeNode)) {
        this.workingPlainText += char
        continue;
      }

      if (!this.areAnyAncestors(LinkNode)) {
        if (this.isMatch('[')) {
          if (this.tryParseInline(LinkNode, '['.length)) {
            this.advanceCountExtraCharsConsumed('[')
            continue
          }
        }
      } else if (parentNode instanceof LinkNode) {
        if (this.isMatch(' -> ')) {
          this.advanceCountExtraCharsConsumed(' -> ')
          this.flushWorkingTextToPlainTextNode()
          isParsingLinkUrl = true
          this.countUnclosedParens = 0;
          this.countUnclosedSquareBrackes = 0;
          continue;
        }

        if (isParsingLinkUrl && this.isMatch(']')) {
          parentNode.url = this.getAndFlushWorkingPlainText()
          this.advanceCountExtraCharsConsumed(' ]')
          this.closeParent()
          break;
        }
      }

      const shouldProbablyOpenEmphasisAndStress =
        this.isMatch('***') && !this.areAnyAncestorsEither([EmphasisNode, StressNode])

      if (shouldProbablyOpenEmphasisAndStress && this.tryOpenBothEmphasisAndStress()) {
        continue
      }

      for (const sandwich of [
        STRESS,
        EMPHASIS,
        REVISION_INSERTION,
        REVISION_DELETION,
        SPOILER,
      ]) {
        if (this.tryOpenOrCloseSandwich(sandwich)) {
          continue main_parser_loop
        }
      }

      this.updateUnclosedBracketCount()
      this.workingPlainText += char
    }

    this.finish()
  }


  private finish() {
    if (this.parentFailedToParse || this.parentNodeClosureStatus === ParentNodeClosureStatus.OpenAndMustBeClosed) {
      this.result = new FailedParseResult();
    } else {
      this.flushWorkingTextToPlainTextNode()
      this.result = new ParseResult(this.resultNodes, this.charIndex, this.parentNode)
    }
  }


  private updateUnclosedBracketCount() {
    switch (this.text[this.charIndex]) {
      case '(':
        this.countUnclosedParens += 1
        break
      case ')':
        this.countUnclosedParens = Math.max(0, this.countUnclosedParens - 1)
        break
      case '[':
        this.countUnclosedSquareBrackes += 1
        break
      case ']':
        this.countUnclosedSquareBrackes = Math.max(0, this.countUnclosedSquareBrackes - 1)
        break
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
  

  private areAnyAncestors(SyntaxNodeType: SyntaxNodeType): boolean {
    return this.isParent(SyntaxNodeType) || this.parentNode.parents().some(ancestor => ancestor instanceof SyntaxNodeType)
  }
  

  private areAnyAncestorsEither(syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return this.isParentEither(syntaxNodeTypes)
      || this.parentNode.parents().some(ancestor => this.isNodeEither(ancestor, syntaxNodeTypes))
  }
  

  private isMatch(needle: string): boolean {
    return (needle === this.text.substr(this.charIndex, needle.length)) && this.areAllRelevantBracketsClosed(needle)
  }
  

  private areAllRelevantBracketsClosed(needle: string): boolean { 
    if (countOf(')', needle) && this.countUnclosedParens) {
      return false;
    }
    
    if (countOf(']', needle) && this.countUnclosedSquareBrackes) {
      return false;
    }
    
    return true
  }


  private advanceCountExtraCharsConsumed(countOrCharsConsumed: number | string): void {
    const countConsumed = (
      typeof countOrCharsConsumed === "string"
        ? countOrCharsConsumed.length
        : countOrCharsConsumed
    )
    this.charIndex += countConsumed - 1
  }


  private getAndFlushWorkingPlainText(): string {
    const workingText = this.workingPlainText
    this.workingPlainText = ''
    return workingText
  }


  private flushWorkingTextToPlainTextNode(): void {
    if (this.workingPlainText) {
      this.resultNodes.push(new PlainTextNode(this.workingPlainText))
    }
    this.workingPlainText = ''
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
      ParentNodeClosureStatus.OpenAndMustBeClosed,
      countCharsThatOpenedNode
    ).result;
  }


  private addParsedNode(parseResult: ParseResult): void {
    this.flushWorkingTextToPlainTextNode()
    parseResult.parentNode.addChildren(parseResult.nodes)
    this.resultNodes.push(parseResult.parentNode)
    this.advanceCountExtraCharsConsumed(parseResult.countCharsConsumed)
  }
  

  private closeParent(): void {
    this.flushWorkingTextToPlainTextNode()
    this.parentNodeClosureStatus = ParentNodeClosureStatus.Closed
    this.reachedEndOfParent = true
  }

  private parseIfCurrentTextIs(needle: string, SyntaxNodeType: SyntaxNodeType): boolean {
    return this.isMatch(needle) && this.tryParseInline(SyntaxNodeType, needle.length)
  }

  private closeParentIfCurrentTextIs(needle: string) {
    if (this.isMatch(needle)) {
      this.closeParent()
      this.advanceCountExtraCharsConsumed(needle);
      return true;
    }
    
    return false;
  }

  private tryOpenOrCloseSandwich(sandwich: InlineSandwich): boolean {
    if (this.isParent(sandwich.SyntaxNodeType)) {
      return this.closeParentIfCurrentTextIs(sandwich.closingBun)
    }
    return this.isMatch(sandwich.bun) && this.tryParseInline(sandwich.SyntaxNodeType, sandwich.bun.length)
  }
  
  
  // "***" opens both a stress node and an emphasis node. Here, we ensure the two nodes can
  // be closed in either order by parsing the text both ways and using the best result.
  private tryOpenBothEmphasisAndStress(): boolean {
    if (!this.isMatch('***') || this.areAnyAncestorsEither([EmphasisNode, StressNode])) {
      return false;
    }
    const startWithEmphasis = this.getInlineParseResult(EmphasisNode, '*'.length)
    const startWithStress = this.getInlineParseResult(StressNode, '**'.length)
    const bestResult = getBestTripleAsteriskParseResult([startWithEmphasis, startWithStress])
    
    if (bestResult) {
      this.addParsedNode(bestResult)
      return true
    }
    
    return false
  }
}


function countOf(char: string, haystack: string): number {
  const matches: RegExpMatchArray = haystack.match(new RegExp(`\\${char}`, 'g')) || [];
  return matches.length
}


function getBestTripleAsteriskParseResult(parseResults: ParseResult[]): ParseResult {
  // We only want to accept valid parse results. And if there are more than one, we
  // accept the result that consumed the most characters.
  //
  // If you're severely curious why, read on.
  //
  // Let's say we have the following text: ***Note:* This is tricky!**
  //
  // Clearly, this should be parsed starting with the stress node:
  //
  //   <stress>
  //     <emphasis>
  //       Note:
  //     </emphasis>
  //     This is tricky!
  //   </stress>
  //
  // Unfortunately, when the parser first sees the "***", it doesn't know whether to parse
  // stress first or emphasis first. It can't simply look ahead for asterisks to see which
  // one gets closed first, because any asterisks it finds could be escaped by a backlash.
  // Or in a code snippet node. Or part of a link's URL. Or one of a bunch of other reasons.
  // So the parser actually has to parse the text both ways.
  //
  // If the parser starts with the emphasis node, it would get to here:
  //
  //   <emphasis>
  //     <stress>
  //       Note:
  //
  // And then the parser would see a single asterisk. This would open new emphasis node,
  // which would eventually bring us to here:
  //
  //   <emphasis>
  //     <stress>
  //       Note:
  //       <emphasis>
  //         This is tricky!
  //       </emphasis>
  //
  // Then, the parser would see another single asterisk. This would open a nested emphasis
  // node, but that one would fail because it never gets closed. So that single asterisk
  // would be interpreted as plain text:
  //
  //   <emphasis>
  //     <stress>
  //       Note:
  //       <emphasis>
  //         This is tricky!
  //       </emphasis>
  //       *
  //
  // But wait! The stress node now fails, because it is never closed, either!
  //
  // So the parser backs up, and rather than interpreting those two asterisks as the
  // beginning of a stress node, it interprets the first of the two as the end of the
  // initial emphasis node:
  // 
  //   <emphasis>
  //   </emphasis>
  //
  // The parser stops, because it has closed the parent node.
  //
  // We get a technically valid parse result, but one which consumes far fewer characters
  // than the desired result (the one created by starting with a stress node).
  //
  // Let's try with some different text: ***Note:** This is tricky!*
  //
  // Unlike the first text, this should clearly be parsed with the emphasis node first:
  //
  //   <emphasis>
  //     <stress>
  //       Note:
  //     </stress>
  //     This is tricky!
  //   </emphasis>
  //
  // In this case, if the parser starts with the stress node, it will arrive here:
  //   
  //   <stress>
  //     <emphasis>
  //       Note:
  //
  // At this point, the parser sees two asterisks. This opens a nested stress node, which
  // eventually fails to parse because it is never closed. So the parser backs up, and
  // rather than interpreting those two asterisks as the beginning of a stress node, it
  // interprets the first of the two as the end of the emphasis node:
  //
  //   <stress>
  //     <emphasis>
  //       Note:
  //     </emphasis>
  //
  // With the first of those two asterisks consumed, the opening stress node has no chance
  // to be closed. It eventually fails to parse, leaving us with only the desired parse
  // result (the one created by starting with an emphasis node).
    
  const sortedResults =
    parseResults.slice()
      .filter(result => result.success())
      .sort((result1, result2) => result2.countCharsConsumed - result1.countCharsConsumed)

  // This function will return null if there are no successful parse results 
  return sortedResults[0]
}