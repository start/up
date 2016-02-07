import { ParseResult } from '.././ParseResult'
import { FailedParseResult } from '.././FailedParseResult'

import { TextConsumer } from '../../TextConsumption/TextConsumer'

import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'

import { LinkParser } from './LinkParser'
import { InlineSandwich } from './InlineSandwich'


export function parseInline(text: string, parentNode: RichSyntaxNode, terminateOn: string = null): ParseResult {
  return new InlineParser(text, parentNode, terminateOn, false).parseResult
}


const INLINE_CODE = new InlineSandwich(InlineCodeNode, '`', '`')
const STRESS = new InlineSandwich(StressNode, '**', '**')
const EMPHASIS = new InlineSandwich(EmphasisNode, '*', '*')
const REVISION_INSERTION = new InlineSandwich(RevisionInsertionNode, '++', '++')
const REVISION_DELETION = new InlineSandwich(RevisionDeletionNode, '~~', '~~')
const SPOILER = new InlineSandwich(SpoilerNode, '[<_<]', '[>_>]')
const INLINE_ASIDE = new InlineSandwich(InlineAsideNode, '((', '))')


class InlineParser {

  public parseResult: ParseResult;
  private nodes: SyntaxNode[] = [];
  private consumer: TextConsumer

  constructor(text: string, private parentNode: RichSyntaxNode, private terminateOn: string = null, private parentRequiresClosing = true) {
    this.consumer = new TextConsumer(text)

    main_parser_loop:
    while (!this.consumer.done()) {
      if (this.parseResult) {
        return
      }

      if (this.tryCloseOrParseSandwich(INLINE_CODE)) {
        continue
      }

      if (this.parentNode instanceof InlineCodeNode) {
        this.addPlainCharNode()
        continue
      }

      if (this.terminatesEarly()) {
        break
      }

      if (this.tryParseLink()) {
        continue
      }

      for (let sandwich of [
        STRESS, EMPHASIS, REVISION_INSERTION, REVISION_DELETION, SPOILER, INLINE_ASIDE
      ]) {
        if (this.tryCloseOrParseSandwich(sandwich)) {
          continue main_parser_loop
        }
      }

      this.addPlainCharNode()
    }

    if (this.parentRequiresClosing) {
      this.fail()
      return
    }

    this.finish(new ParseResult(this.nodes, this.consumer.countCharsAdvanced()))
  }


  private tryParseLink(): boolean {
    const linkResult = new LinkParser(this.consumer.remaining(), this.parentNode).result

    if (!linkResult.success) {
      return false
    }

    this.nodes.push.apply(this.nodes, linkResult.nodes)
    this.consumer.skip(linkResult.countCharsParsed)

    return true
  }


  tryCloseOrParseSandwich(sandwich: InlineSandwich): boolean {
    return this.tryCloseSandwich(sandwich) || this.tryParseSandwich(sandwich)
  }


  private tryParseSandwich(sandwich: InlineSandwich): boolean {
    return this.consumer.consumeIf(sandwich.openingBun, (remaining, skip, reject) => {
      const sandwichNode = new sandwich.NodeType()
      sandwichNode.parentNode = this.parentNode

      const parseResult = new InlineParser(remaining, sandwichNode, this.terminateOn).parseResult

      if (!parseResult.success) {
        reject()
        return
      }

      sandwichNode.addChildren(parseResult.nodes)
      this.nodes.push(sandwichNode)

      skip(parseResult.countCharsParsed)
    })
  }


  private tryCloseSandwich(sandwich: InlineSandwich): boolean {
    if (this.parentNode instanceof sandwich.NodeType && this.consumer.consumeIf(sandwich.closingBun)) {
      this.parentRequiresClosing = false
      this.finish(new ParseResult(this.nodes, this.consumer.countCharsAdvanced()))
      return true
    }

    return false
  }


  private finish(result: ParseResult): void {
    this.parseResult = result
  }


  private fail(): void {
    this.parseResult = new FailedParseResult()
  }


  private addPlainCharNode(): void {
    this.nodes.push(new PlainTextNode(this.consumer.currentChar()))
    this.consumer.moveNext()
  }


  private terminatesEarly(): boolean {
    return this.terminateOn && this.consumer.consumeIf(this.terminateOn)
  }
}