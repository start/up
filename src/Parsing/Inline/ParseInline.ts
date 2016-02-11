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


const parseStress = getSandwichParser(StressNode, '**', '**')
const parseEmphasis = getSandwichParser(EmphasisNode, '*', '*')
const parseRevisionInsertion = getSandwichParser(RevisionInsertionNode, '++', '++')
const parseRevisionDeletion = getSandwichParser(RevisionDeletionNode, '~~', '~~')
const parseSpoiler = getSandwichParser(SpoilerNode, '[<_<]', '[>_>]')
const parseInlineAside = getSandwichParser(InlineAsideNode, '((', '))')

const parsers = [
  parseCode,
  parseLink,
  parseStress,
  parseEmphasis,
  parseRevisionInsertion,
  parseRevisionDeletion,
  parseSpoiler,
  parseInlineAside
]

export function parseInline(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const nodes: SyntaxNode[] = [];
  const consumer = new TextConsumer(text)

  function onSuccessfulParse() {
    onParse(nodes, consumer.countCharsAdvanced())
  }

  main_parser_loop:
  while (!consumer.done()) {
    for (let parser of parsers) {
      if (parser(consumer.remaining(), parseArgs, (resultNodes: SyntaxNode[], countCharsParsed: number) => {
        nodes.push.apply(nodes, resultNodes)
        consumer.skip(countCharsParsed)
      })) {
        continue main_parser_loop
      }
    }

    if (parseArgs.terminator && consumer.consumeIf(parseArgs.terminator)) {
      onSuccessfulParse()
      return true
    }

    nodes.push(new PlainTextNode(consumer.currentChar()))
    consumer.moveNext()
  }

  if (parseArgs.terminator) {
    return false
  }

  onSuccessfulParse()
  return true
}
