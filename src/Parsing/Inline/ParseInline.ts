import { ParseResult } from '.././ParseResult'
import { FailedParseResult } from '.././FailedParseResult'

import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { ConsumedTextResult } from '../../TextConsumption/ConsumedTextResult'

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
  return new InlineParser(new TextConsumer(text), parentNode, terminateOn, false).result
}

const INLINE_CODE = new InlineSandwich(InlineCodeNode, '`', '`')
const STRESS = new InlineSandwich(StressNode, '**', '**')
const EMPHASIS = new InlineSandwich(EmphasisNode, '*', '*')
const REVISION_INSERTION = new InlineSandwich(RevisionInsertionNode, '++', '++')
const REVISION_DELETION = new InlineSandwich(RevisionDeletionNode, '~~', '~~')
const SPOILER = new InlineSandwich(SpoilerNode, '[<_<]', '[>_>]')
const INLINE_ASIDE = new InlineSandwich(InlineAsideNode, '((', '))')


class InlineParser {

  public result: ParseResult;
  private nodes: SyntaxNode[] = [];

  constructor(private consumer: TextConsumer, private parentNode: RichSyntaxNode, private terminateOn: string = null, private mustCloseParent = true) {
    
    main_parser_loop:
    while (!this.consumer.done()) {
      if (this.result) {
        return
      }

      if (this.tryOpenOrCloseSandiwch(INLINE_CODE)) {
        continue
      }

      if (this.parentNode instanceof InlineCodeNode) {
        this.addPlainCharNode()
        continue
      }

      if (this.terminatedEarly()) {
        break
      }

      if (this.tryParseLink()) {
        continue
      }

      for (let sandwhich of [
        STRESS, EMPHASIS, REVISION_INSERTION, REVISION_DELETION, SPOILER, INLINE_ASIDE
      ]) {
        if (this.tryOpenOrCloseSandiwch(sandwhich)) {
          continue main_parser_loop
        }
      }

      this.addPlainCharNode()
    }

    if (this.mustCloseParent) {
      this.finish(new FailedParseResult())
      return
    }

    this.finish(new ParseResult(this.nodes, this.consumer.countCharsAdvanced()))
  }


  private tryParseLink(): boolean {
    const linkResult = new LinkParser(new TextConsumer(this.consumer.remaining()), this.parentNode).result

    if (!linkResult.success()) {
      return false
    }
    
    this.nodes.push.apply(this.nodes, linkResult.nodes)
    this.consumer.skip(linkResult.countCharsConsumed)

    return true
  }


  tryOpenOrCloseSandiwch(sandwich: InlineSandwich): boolean {

    if (this.parentNode instanceof sandwich.NodeType) {
      return this.consumer.consume(sandwich.closingBun, (reject, consumer) => {
        this.finish(new ParseResult(this.nodes, consumer.countCharsAdvanced()))
      })
    }

    return this.consumer.consume(sandwich.openingBun, (reject, consumer) => {
      const sandwichNode = new sandwich.NodeType()
      const sandwichResult = new InlineParser(consumer, sandwichNode, this.terminateOn).result

      if (!sandwichResult.success()) {
        reject()
        return
      }

      sandwichNode.addChildren(sandwichResult.nodes)
      this.nodes.push(sandwichNode)

      consumer.skip(sandwichResult.countCharsConsumed)
    })
  }


  private finish(result: ParseResult): void {
    this.result = result
  }


  private fail(): void {
    this.result = new FailedParseResult()
  }


  private addPlainCharNode(): void {
    this.nodes.push(new PlainTextNode(this.consumer.currentChar()))
    this.consumer.moveNext()
  }
  

  private terminatedEarly(): boolean {
    return this.terminateOn && this.consumer.consume(this.terminateOn)
  }
}