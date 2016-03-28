import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { tokenize } from './Tokenize'
import { RICH_SANDWICHES } from './RichSandwiches'


export class ParseResult {
  constructor(
    public nodes: InlineSyntaxNode[],
    public countTokensParsed: number) { }
}


export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}


function parseUntil(tokens: Token[], terminator?: TokenMeaning): ParseResult {
  const nodes: InlineSyntaxNode[] = []
  let stillNeedsTerminator = !!terminator
  let countParsed = 0

  MainParserLoop:
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    countParsed = index + 1

    if (token.meaning === terminator) {
      stillNeedsTerminator = false
      break
    }

    switch (token.meaning) {
      case TokenMeaning.PlainText:
        nodes.push(new PlainTextNode(token.value))
        continue

      case TokenMeaning.InlineCode: {
        nodes.push(new InlineCodeNode(token.value))
        continue
      }
      
      case TokenMeaning.LinkStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.LinkUrlAndLinkEnd)
        index += result.countTokensParsed
        
        // The URL was in the LinkUrlAndEnd token, the last token we parsed
        const url = tokens[index - 1].value
        nodes.push(new LinkNode(result.nodes, url))
        
        continue
      }
    }

    for (const sandwich of RICH_SANDWICHES) {
      if (token.meaning === sandwich.convention.startMeaning()) {
        const result = parseUntil(tokens.slice(countParsed), sandwich.convention.endMeaning())
        index += result.countTokensParsed
        nodes.push(new sandwich.NodeType(result.nodes))

        continue MainParserLoop
      }
    }
  }

  if (stillNeedsTerminator) {
    throw new Error('Missing token')
  }

  return new ParseResult(nodes, countParsed)
}