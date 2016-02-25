import { TextConsumer } from '../TextConsumer'
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
import { parseInlineCode } from './ParseInlineCode'
import { getSandwichParser } from './GetSandwichParser'
import { parseLink } from './ParseLink'
import { last } from '../CollectionHelpers'
import { InlineParserArgs, InlineParser } from './InlineParser'


const inlineParsers = [
  parseInlineCode,
  parseLink,
  getSandwichParser(StressNode, '**', '**'),
  getSandwichParser(EmphasisNode, '*', '*'),
  getSandwichParser(RevisionInsertionNode, '++', '++'),
  getSandwichParser(RevisionDeletionNode, '~~', '~~'),
  getSandwichParser(SpoilerNode, '[<_<]', '[>_>]'),
  getSandwichParser(InlineAsideNode, '((', '))')
]

export function parseInlineConventions(args: InlineParserArgs): boolean {
  const { text, endsWith, doesNotHave, parentNode, then } = args
    
  const nodes: SyntaxNode[] = [];
  const consumer = new TextConsumer(text)

  main_parser_loop:
  while (!consumer.done()) {

    for (let parse of inlineParsers) {

      const didConventionParseSuccessfully =
        parse({
          text: consumer.remainingText(),
          parentNode: parentNode,
          endsWith: endsWith,
          then: (resultNodes, lengthParsed) => {
            nodes.push(...resultNodes)
            consumer.skip(lengthParsed)
          }
        })

      if (didConventionParseSuccessfully) {
        continue main_parser_loop
      }
    }

    if (endsWith && consumer.consumeIfMatches(endsWith)) {
      then(nodes, consumer.lengthConsumed())
      return true
    }

    if (doesNotHave && consumer.consumeIfMatches(doesNotHave)) {
      return false
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

  if (endsWith) {
    return false
  }

  then(nodes, consumer.lengthConsumed())
  return true
}