import { TextConsumer } from '../TextConsumer'
import { ParseContext, Parser, OnParse } from '../Parser'
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
import { last } from '../CollectionHelpers'


const conventionParsers = [
  parseCode,
  parseLink,
  getSandwichParser(StressNode, '**', '**'),
  getSandwichParser(EmphasisNode, '*', '*'),
  getSandwichParser(RevisionInsertionNode, '++', '++'),
  getSandwichParser(RevisionDeletionNode, '~~', '~~'),
  getSandwichParser(SpoilerNode, '[<_<]', '[>_>]'),
  getSandwichParser(InlineAsideNode, '((', '))')
]

export function parseInline(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {
  const nodes: SyntaxNode[] = [];
  const consumer = new TextConsumer(text)

  main_parser_loop:
  while (!consumer.done()) {

    for (let parser of conventionParsers) {
      if (parser(consumer.remainingText(), parseArgs,
        (resultNodes, countCharsParsed) => {
          nodes.push.apply(nodes, resultNodes)
          consumer.skip(countCharsParsed)
        })) {
        continue main_parser_loop
      }
    }

    if (parseArgs.inlineTerminator && consumer.consumeIfMatches(parseArgs.inlineTerminator)) {
      onParse(nodes, consumer.countCharsConsumed(), parseArgs.parentNode)
      return true
    }

    const lastNode = last(nodes)
    const currentChar = consumer.escapedCurrentChar()
    
    if (lastNode instanceof PlainTextNode) {
      lastNode.text += currentChar  
    } else {
      nodes.push(new PlainTextNode(currentChar))
    }
    
    consumer.moveNext()
  }

  if (parseArgs.inlineTerminator) {
    return false
  }

  onParse(nodes, consumer.countCharsConsumed(), parseArgs.parentNode)
  return true
}