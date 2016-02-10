import { ParseResult } from '.././ParseResult'
import { FailedParseResult } from '.././FailedParseResult'

import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { Parser, OnParse } from '../Parser'

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

import { parseCode } from './parseCode'
import { getSandwichParser } from './GetSandwichParser'
import { LinkParser } from './LinkParser'
import { InlineSandwich } from './InlineSandwich'


export function parseInline(text: string, parentNode: RichSyntaxNode, terminateOn: string = null): ParseResult {
  return new InlineParser(text, parentNode, terminateOn, false).parseResult
}

const STRESS = getSandwichParser(StressNode, '**', '**')
const EMPHASIS = getSandwichParser(EmphasisNode, '*', '*')
const REVISION_INSERTION = getSandwichParser(RevisionInsertionNode, '++', '++')
const REVISION_DELETION = getSandwichParser(RevisionDeletionNode, '~~', '~~')
const SPOILER = getSandwichParser(SpoilerNode, '[<_<]', '[>_>]')
const INLINE_ASIDE = getSandwichParser(InlineAsideNode, '((', '))')

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

      if (parseCode(this.consumer.remaining(), this.parentNode, (resultNodes, countCharsParsed) => {
        this.nodes.push.apply(this.nodes, resultNodes)
        this.consumer.skip(countCharsParsed)
      })) {
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
        if (sandwich(this.consumer.remaining(), this.parentNode, (resultNodes, countCharsParsed) => {
          this.nodes.push.apply(this.nodes, resultNodes)
          this.consumer.skip(countCharsParsed)
        })) {
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