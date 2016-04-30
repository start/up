import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { PlainTextNode, isWhitespace } from '../../SyntaxNodes/PlainTextNode'
import { InlineTextConsumer } from './InlineTextConsumer'
import { last } from '../CollectionHelpers'
import { tokenize } from './Tokenize'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './SandwichConventions'

import { AudioToken } from './Tokens/AudioToken'
import { EmphasisEndToken } from './Tokens/EmphasisEndToken'
import { EmphasisStartToken } from './Tokens/EmphasisStartToken'
import { FootnoteReferenceEndToken } from './Tokens/FootnoteReferenceEndToken'
import { FootnoteReferenceStartToken } from './Tokens/FootnoteReferenceStartToken'
import { ImageToken } from './Tokens/ImageToken'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { PotentialRaisedVoiceEndToken } from './Tokens/PotentialRaisedVoiceEndToken'
import { PotentialRaisedVoiceStartOrEndToken } from './Tokens/PotentialRaisedVoiceStartOrEndToken'
import { PotentialRaisedVoiceStartToken } from './Tokens/PotentialRaisedVoiceStartToken'
import { SpoilerEndToken } from './Tokens/SpoilerEndToken'
import { SpoilerStartToken } from './Tokens/SpoilerStartToken'
import { StressEndToken } from './Tokens/StressEndToken'
import { VideoToken } from './Tokens/VideoToken'
import { Token, TokenType } from './Tokens/Token'


export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return parseUntil(tokens).nodes
}


const SANDWICHES = [
  STRESS,
  EMPHASIS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE
]

const MEDIA_CONVENTIONS = [
  AUDIO,
  IMAGE,
  VIDEO
]


function parseUntil(tokens: Token[], terminator?: TokenType): ParseResult {
  const nodes: InlineSyntaxNode[] = []
  let stillNeedsTerminator = !!terminator
  let countParsed = 0

  MainParserLoop:
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    countParsed = index + 1

    if (terminator && token instanceof terminator) {
      stillNeedsTerminator = false
      break
    }

    if (token instanceof PlainTextToken) {
      const lastNode = last(nodes)

      if (lastNode instanceof PlainTextNode) {
        lastNode.text += token.text
      } else {
        nodes.push(new PlainTextNode(token.text))
      }

      continue
    }

    if (token instanceof InlineCodeToken) {
      // Empty inline code isn't meaningful, so we discard it
      if (token.code) {
        nodes.push(new InlineCodeNode(token.code))
      }

      continue
    }

    if (token instanceof LinkStartToken) {
      const result = parseUntil(tokens.slice(countParsed), LinkEndToken)
      index += result.countTokensParsed

      let contents = result.nodes
      const hasContents = isNotPureWhitespace(contents)

      // The URL was in the LinkEndToken, the last token we parsed
      //
      // TODO: Move URL to LinkStartToken
      const linkEndToken = <LinkEndToken>tokens[index]
      
      let url = linkEndToken.url.trim()
      const hasUrl = !!url

      if (!hasContents && !hasUrl) {
        // If there's no content and no URL, there's nothing meaninful to include in the document
        continue
      }

      if (hasContents && !hasUrl) {
        // If there's content but no URL, we include the content directly in the document without producing
        // a link node
        nodes.push(...contents)
        continue
      }

      if (!hasContents && hasUrl) {
        // If there's no content but we have a URL, we'll use the URL for the content
        contents = [new PlainTextNode(url)]
      }

      nodes.push(new LinkNode(contents, url))
      continue
    }


    for (const media of MEDIA_CONVENTIONS) {
      if (token instanceof media.TokenType) {
        let description = token.description.trim()
        const url = token.url.trim()

        if (!url) {
          // If there's no URL, there's nothing meaningful to include in the document
          continue MainParserLoop
        }

        if (!description) {
          // If there's no description, we treat the URL as the description
          description = url
        }

        nodes.push(new media.NodeType(description, url))
        continue MainParserLoop
      }
    }

    for (const sandwich of SANDWICHES) {
      if (token instanceof sandwich.StartTokenType) {
        const result = parseUntil(tokens.slice(countParsed), sandwich.EndTokenType)
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

function isNotPureWhitespace(nodes: InlineSyntaxNode[]): boolean {
  return !nodes.every(isWhitespace)
}


class ParseResult {
  constructor(
    public nodes: InlineSyntaxNode[],
    public countTokensParsed: number) { }
}
