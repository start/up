import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { isWhitespace } from '../../SyntaxNodes/isWhitespace'
import { last } from '../../CollectionHelpers'
import { ParenthesizedStartToken } from './Tokens/ParenthesizedStartToken'
import { ParenthesizedEndToken } from './Tokens/ParenthesizedEndToken'
import { SquareBracketedStartToken } from './Tokens/SquareBracketedStartToken'
import { SquareBracketedEndToken } from './Tokens/SquareBracketedEndToken'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { Token } from './Tokens/Token'
import { TokenType } from './Tokens/TokenType'
import { NakedUrlToken } from './Tokens/NakedUrlToken'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './RichConventions'
import { ParseResult } from './ParseResult'


// TODO: Heavily refactor duplicate code

const RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES = [
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


export function parse(
  args: {
    tokens: Token[],
    UntilTokenType?: TokenType,
    isTerminatorOptional?: boolean
  }
): ParseResult {
  const { tokens, UntilTokenType, isTerminatorOptional } = args

  const nodes: InlineSyntaxNode[] = []

  let countTokensParsed = 0

  LoopTokens: for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    countTokensParsed = tokenIndex + 1

    if (UntilTokenType && token instanceof UntilTokenType) {
      return {
        countTokensParsed,
        nodes: combineConsecutivePlainTextNodes(nodes),
        isMissingTerminator: false
      }
    }

    if (token instanceof PlainTextToken) {
      if (!token.text) {
        continue
      }

      nodes.push(new PlainTextNode(token.text))
      continue
    }

    if (token instanceof ParenthesizedStartToken) {
      const result = parse({
        tokens: tokens.slice(countTokensParsed),
        UntilTokenType: ParenthesizedEndToken,
        isTerminatorOptional: true
      })

      tokenIndex += result.countTokensParsed

      const resultNodes =
        [<InlineSyntaxNode>new PlainTextNode('(')]
          .concat(...result.nodes)

      if (result.isMissingTerminator) {
        nodes.push(...combineConsecutivePlainTextNodes(resultNodes))
        continue
      }

      resultNodes.push(new PlainTextNode(')'))
      nodes.push(new ParenthesizedNode(combineConsecutivePlainTextNodes(resultNodes)))

      continue
    }

    if (token instanceof SquareBracketedStartToken) {
      const result = parse({
        tokens: tokens.slice(countTokensParsed),
        UntilTokenType: SquareBracketedEndToken,
        isTerminatorOptional: true
      })

      tokenIndex += result.countTokensParsed

      const resultNodes =
        [<InlineSyntaxNode>new PlainTextNode('[')]
          .concat(...result.nodes)

      if (result.isMissingTerminator) {
        nodes.push(...combineConsecutivePlainTextNodes(resultNodes))
        continue
      }

      resultNodes.push(new PlainTextNode(']'))
      nodes.push(new SquareBracketedNode(combineConsecutivePlainTextNodes(resultNodes)))

      continue
    }

    if (token instanceof InlineCodeToken) {
      // Empty inline code isn't meaningful, so we discard it
      if (token.code) {
        nodes.push(new InlineCodeNode(token.code))
      }

      continue
    }

    if (token instanceof NakedUrlToken) {
      const content = [new PlainTextNode(token.restOfUrl)]
      nodes.push(new LinkNode(content, token.url()))

      continue
    }

    if (token instanceof LinkStartToken) {
      const result = parse({
        tokens: tokens.slice(countTokensParsed),
        UntilTokenType: LinkEndToken
      })

      tokenIndex += result.countTokensParsed

      let contents = result.nodes
      const hasContents = isNotPureWhitespace(contents)

      // The URL was in the LinkEndToken, the last token we parsed
      //
      // TODO: Move URL to LinkStartToken?
      const linkEndToken = <LinkEndToken>tokens[tokenIndex]

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
          continue LoopTokens
        }

        if (!description) {
          // If there's no description, we treat the URL as the description
          description = url
        }

        nodes.push(new media.NodeType(description, url))
        continue LoopTokens
      }
    }

    for (const richConvention of RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES) {
      if (token instanceof richConvention.StartTokenType) {
        const result = parse({
          tokens: tokens.slice(countTokensParsed),
          UntilTokenType: richConvention.EndTokenType
        })

        tokenIndex += result.countTokensParsed

        if (result.nodes.length) {
          // Like empty inline code, we discard any empty sandwich convention
          nodes.push(new richConvention.NodeType(result.nodes))
        }

        continue LoopTokens
      }
    }
  }

  const wasTerminatorSpecified = !!UntilTokenType

  if (!isTerminatorOptional && wasTerminatorSpecified) {
    throw new Error(`Missing terminator token: ${UntilTokenType}`)
  }

  return {
    countTokensParsed,
    nodes: combineConsecutivePlainTextNodes(nodes),
    isMissingTerminator: wasTerminatorSpecified
  }
}


function isNotPureWhitespace(nodes: InlineSyntaxNode[]): boolean {
  return !nodes.every(isWhitespace)
}

function combineConsecutivePlainTextNodes(nodes: InlineSyntaxNode[]): InlineSyntaxNode[] {
  const resultNodes: InlineSyntaxNode[] = []

  for (const node of nodes) {
    const lastNode = last(resultNodes)

    if ((node instanceof PlainTextNode) && (lastNode instanceof PlainTextNode)) {
      lastNode.text += node.text
      continue
    }

    resultNodes.push(node)
  }

  return resultNodes
}