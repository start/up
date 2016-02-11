import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { ParseArgs, Parser, OnParse } from '../Parser'
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
import { parseLink } from './ParseLink'


const parsers = [
  parseCode,
  parseLink,
  getSandwichParser(StressNode, '**', '**'),
  getSandwichParser(EmphasisNode, '*', '*'),
  getSandwichParser(RevisionInsertionNode, '++', '++'),
  getSandwichParser(RevisionDeletionNode, '~~', '~~'),
  getSandwichParser(SpoilerNode, '[<_<]', '[>_>]'),
  getSandwichParser(InlineAsideNode, '((', '))')
]

export function parseInline(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const nodes: SyntaxNode[] = [];
  const consumer = new TextConsumer(text)

  main_parser_loop:
  while (!consumer.done()) {

    for (let parser of parsers) {
      if (parser(consumer.remaining(), parseArgs,
        (resultNodes, countCharsParsed) => {
          nodes.push.apply(nodes, resultNodes)
          consumer.skip(countCharsParsed)
        })) {
        continue main_parser_loop
      }
    }

    if (parseArgs.terminator && consumer.consumeIf(parseArgs.terminator)) {
      onParse(nodes, consumer.countCharsAdvanced(), parseArgs.parentNode)
      return true
    }

    nodes.push(new PlainTextNode(consumer.currentChar()))
    consumer.moveNext()
  }

  if (parseArgs.terminator) {
    return false
  }

  onParse(nodes, consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}
