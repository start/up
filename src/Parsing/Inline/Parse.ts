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
      
      case TokenMeaning.PlainText: {
        const lastNode = last(nodes)
        
        if (lastNode instanceof PlainTextNode) {
          lastNode.text += token.value
        } else {
          nodes.push(new PlainTextNode(token.value))
        }
        
        continue
      }

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

        let contents = result.nodes
        const hasContents = isNotPureWhitespace(contents)

        // The URL was in the LinkUrlAndEnd token, the last token we parsed
        let url = tokens[index].value.trim()
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
    }

    for (const media of MEDIA_CONVENTIONS) {
      if (token.meaning === media.tokenMeaningForStartAndDescription) {
        let description = token.value.trim()

        // We know the next token will be TokenMeaning.AudioUrlAndAudioEnd
        index += 1
        const url = tokens[index].value.trim()

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
      if (token.meaning === sandwich.convention.startTokenType()) {
        const result = parseUntil(tokens.slice(countParsed), sandwich.convention.endTokenType())
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
