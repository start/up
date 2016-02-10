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


export function parseInline(text: string, parentNode: RichSyntaxNode, parentTerminator: string = null): ParseResult {
  return new InlineParser(text, parentNode, parentTerminator).parseResult
}

const parseStress = getSandwichParser(StressNode, '**', '**')
const parseEmphasis = getSandwichParser(EmphasisNode, '*', '*')
const parseRevisionInsertion = getSandwichParser(RevisionInsertionNode, '++', '++')
const parseRevisionDeletion = getSandwichParser(RevisionDeletionNode, '~~', '~~')
const parseSpoiler = getSandwichParser(SpoilerNode, '[<_<]', '[>_>]')
const parseInlineAside = getSandwichParser(InlineAsideNode, '((', '))')

class InlineParser {

  public parseResult: ParseResult;
  private nodes: SyntaxNode[] = [];
  private consumer: TextConsumer

  constructor(text: string, private parentNode: RichSyntaxNode, private parentTerminator: string = null) {
    this.consumer = new TextConsumer(text)
    
    const includeParseResult = (resultNodes: SyntaxNode[], countCharsParsed: number) => {
      this.nodes.push.apply(this.nodes, resultNodes)
      this.consumer.skip(countCharsParsed)
    }

    main_parser_loop:
    while (!this.consumer.done()) {
      if (this.parseResult) {
        return
      }

      if (parseCode(this.consumer.remaining(), this.parentNode, includeParseResult)) {
        continue
      }

      if (this.tryParseLink()) {
        continue
      }

      for (let parseSandwich of [
        parseStress, parseEmphasis, parseRevisionInsertion, parseRevisionDeletion, parseSpoiler, parseInlineAside
      ]) {
        if (parseSandwich(this.consumer.remaining(), this.parentNode, parentTerminator, includeParseResult)) {
          continue main_parser_loop
        }
      }

      if (this.parentTerminator && this.consumer.consumeIf(this.parentTerminator)) {
        this.succeed()
        return
      }

      this.nodes.push(new PlainTextNode(this.consumer.currentChar()))
      this.consumer.moveNext()
    }

    if (this.parentTerminator) {
      this.fail()
      return
    }

    this.succeed()
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


  private succeed(): void {
    this.parseResult = new ParseResult(this.nodes, this.consumer.countCharsAdvanced())
  }


  private fail(): void {
    this.parseResult = new FailedParseResult()
  }
}