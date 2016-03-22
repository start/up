import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
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
import { SPOILER, INLINE_ASIDE } from './RussianDolls'


export class ParseResult {
  constructor(
    public nodes: InlineSyntaxNode[],
    public countTokensParsed: number) { }
}

export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}

class TypicalRichConvention {
  constructor(
    public NodeType: RichInlineSyntaxNodeType,
    public meaningStart: TokenMeaning,
    public meaningEnd: TokenMeaning) { }
}

const TYPICAL_RICH_CONVENTION = [
  STRESS,
  EMPHASIS,
  REVISION_DELETION
].map(sandwich => new TypicalRichConvention(sandwich.NodeType, sandwich.meaningStart, sandwich.meaningEnd))
  .concat([
    SPOILER,
    INLINE_ASIDE
  ].map((russianDoll) => new TypicalRichConvention(russianDoll.NodeType, russianDoll.meaningStart, russianDoll.meaningEnd)))

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
    }

    for (const convention of TYPICAL_RICH_CONVENTION) {
      if (token.meaning === convention.meaningStart) {
        const result = parseUntil(tokens.slice(countParsed), convention.meaningEnd)
        nodes.push(new convention.NodeType(result.nodes))
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