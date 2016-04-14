import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TextConsumer } from '../TextConsumer'
import { last } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { tokenize } from './Tokenize'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from './Sandwiches'


export class ParseResult {
  constructor(
    public nodes: InlineSyntaxNode[],
    public countTokensParsed: number) { }
}


export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}


const SANDWICHES = [
  STRESS,
  EMPHASIS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  INLINE_ASIDE
]


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
        // Empty inline code isn't meaningful, so we discard it
        if (token.value) {
          nodes.push(new InlineCodeNode(token.value))
        }
        
        continue
      }

      case TokenMeaning.LinkStart: {
        const result = parseUntil(tokens.slice(countParsed), TokenMeaning.LinkUrlAndLinkEnd)
        index += result.countTokensParsed

        // The URL was in the LinkUrlAndEnd token, the last token we parsed
        let url = tokens[index].value
        const contents = result.nodes

        if (!contents.length && !url) {
          // If there's no content and no URL, there's nothing meaninful to include in the document
          continue
        }

        if (contents.length && !url) {
          // If there's content but no URL, we include the content directly in the document without producing
          // a link node
          nodes.push(...contents)
          continue
        }

        if (!contents.length && url) {
          // If there's no content but we have a URL, we'll use the URL for the content
          contents.push(new PlainTextNode(url))
        }

        nodes.push(new LinkNode(contents, url))
        continue
      }

      case TokenMeaning.AudioStartAndAudioDescription: {
        let description = token.value
        
        // We know the next token will be TokenMeaning.AudioUrlAndAudioEnd
        index += 1
        const url = tokens[index].value
        
        if (!url) {
          // If there's no URL, there's nothing meaningful to include in the document
          continue
        }
        
        if (!description) {
          // If there's no description, we treat the URL as the description
          description = url
        }
        
        nodes.push(new AudioNode(description, url))
        continue
      }
    }

    for (const sandwich of SANDWICHES) {
      if (token.meaning === sandwich.convention.startTokenMeaning()) {
        const result = parseUntil(tokens.slice(countParsed), sandwich.convention.endTokenMeaning())
        index += result.countTokensParsed

        if (result.nodes.length) {
          // Like empty inline code, we discard any empty sandwich convention
          nodes.push(new sandwich.NodeType(result.nodes))
        }

        continue MainParserLoop
      }
    }
  }

  if (stillNeedsTerminator) {
    throw new Error('Missing token')
  }

  return new ParseResult(nodes, countParsed)
}