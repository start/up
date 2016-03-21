import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { tokenize } from './Tokenize'


export class ParseResult {
  constructor(public nodes: InlineSyntaxNode[], public countTokensParsed: number) { }
}


export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}


function parseUntil(tokens: Token[], terminator?: TokenMeaning): ParseResult {
  const nodes: InlineSyntaxNode[] = []
  let stillNeedsTerminator = !!terminator
  let countParsed = 0

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

      case TokenMeaning.StressStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.StressEnd)
        nodes.push(new StressNode(result.nodes))
        index += result.countTokensParsed
        continue
      }

      case TokenMeaning.EmphasisStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.EmphasisEnd)
        nodes.push(new EmphasisNode(result.nodes))
        index += result.countTokensParsed
        continue
      }

      case TokenMeaning.RevisionDeletionStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.RevisionDeletionEnd)
        nodes.push(new RevisionDeletionNode(result.nodes))
        index += result.countTokensParsed
        continue
      }

      case TokenMeaning.SpoilerStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.SpoilerEnd)
        nodes.push(new SpoilerNode(result.nodes))
        index += result.countTokensParsed
        continue
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