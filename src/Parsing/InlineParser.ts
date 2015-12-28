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
  private workingText = '';
  private charIndex = 0;

  constructor(
    private text: string,
    private parentNode: SyntaxNode,
    private parentNodeClosureStatus: ParentNodeClosureStatus,
    countCharsConsumedOpeningParentNode = 0) {

    let isNextCharEscaped = false

    main_parser_loop:
    for (this.charIndex = countCharsConsumedOpeningParentNode; this.charIndex < text.length; this.charIndex += 1) {
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

      if (this.tryOpenOrCloseSandwich(INLINE_CODE)) {
        continue;
      }

      if (this.isParent(InlineCodeNode)) {
        this.workingText += char
        continue;
      }

      const shouldProbablyOpenEmphasisAndStress =
        this.isCurrentText('***') && !this.areAnyAncestorsEither([EmphasisNode, StressNode])

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

      this.workingText += char
    }

    this.finish()
  }


  private finish() {
    if (this.parentFailedToParse || this.parentNodeClosureStatus === ParentNodeClosureStatus.OpenAndMustBeClosed) {
      this.result = new FailedParseResult();
    } else {
      this.flushWorkingText()
      this.result = new ParseResult(this.resultNodes, this.charIndex, this.parentNode)
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

  private areAnyAncestorsEither(syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return this.isParentEither(syntaxNodeTypes)
      || this.parentNode.parents().some(ancestor => this.isNodeEither(ancestor, syntaxNodeTypes))
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
      ParentNodeClosureStatus.OpenAndMustBeClosed,
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

  private tryOpenOrCloseSandwich(sandwich: InlineSandwich): boolean {
    if (this.isParent(sandwich.SyntaxNodeType)) {
      return this.closeParentIfCurrentTextIs(sandwich.closingBun)
    }

    return this.isCurrentText(sandwich.bun) && this.tryParseInline(sandwich.SyntaxNodeType, sandwich.bun.length)
  }
  
  // "***" opens both a stress node and an emphasis node. Here, we ensure the two nodes can
  // be closed in either order by parsing the text both ways and using the best result.
  private tryOpenBothEmphasisAndStress(): boolean {
    if (!this.isCurrentText('***') || this.areAnyAncestorsEither([EmphasisNode, StressNode])) {
      return false;
    }

    const startWithEmphasis = this.getInlineParseResult(EmphasisNode, '*'.length)
    const startWithStress = this.getInlineParseResult(StressNode, '**'.length)

    return this.tryAcceptBestTripleAsteriskParseResult([startWithEmphasis, startWithStress])
  }

  private tryAcceptBestTripleAsteriskParseResult(parseResults: ParseResult[]): boolean {
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

    if (!sortedResults.length) {
      return false;
    }

    this.addParsedNode(sortedResults[0])
    return true;
  }
}