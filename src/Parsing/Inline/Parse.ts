import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { tokenize } from './Tokenize'
import { STRESS, EMPHASIS, REVISION_DELETION } from './Sandwiches'


export class ParseResult {
  constructor(public nodes: InlineSyntaxNode[], public countTokensParsed: number) { }
}


export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}

const SANDWICHES = [STRESS, EMPHASIS, REVISION_DELETION]

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
      case TokenMeaning.Text:
        nodes.push(new PlainTextNode(token.value))
        continue

      case TokenMeaning.InlineCodeStart: {
        const result = parseInlineCode(tokens.slice(countParsed))
        nodes.push(...result.nodes)
        index += result.countTokensParsed
        continue
      }

      case TokenMeaning.SpoilerStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.SpoilerEnd)
        nodes.push(new SpoilerNode(result.nodes))
        index += result.countTokensParsed
        continue
      }

      case TokenMeaning.InlineAsideStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.InlineAsideEnd)
        nodes.push(new InlineAsideNode(result.nodes))
        index += result.countTokensParsed
        continue
      }
    }

    for (const sandwich of SANDWICHES) {
      if (token.meaning === sandwich.start) {
        const result = parseUntil(tokens.slice(countParsed), sandwich.end)
        nodes.push(new sandwich.nodeType(result.nodes))
        index += result.countTokensParsed
        
        continue MainParserLoop
      }
    }
  }

  if (stillNeedsTerminator) {
    throw new Error('Missing token')
  }

  return new ParseResult(nodes, countParsed)
}

function parseInlineCode(tokens: Token[]): ParseResult {
  let text = ''

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.meaning === TokenMeaning.InlineCodeEnd) {
      return new ParseResult([new InlineCodeNode(text)], i + 1)
    }

    text += token.value
  }
}