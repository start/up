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


interface ParseArgs {
  tokens: Token[],
  UntilTokenType?: TokenType,
  isTerminatorOptional?: boolean
}


export function parse(args: ParseArgs): ParseResult {
  return new Parser(args).result
}

class Parser {
  private tokens: Token[]
  private tokenIndex = 0
  private countTokensParsed = 0

  result: ParseResult

  constructor(args: ParseArgs) {
    const { UntilTokenType, isTerminatorOptional } = args
    this.tokens = args.tokens

    const nodes: InlineSyntaxNode[] = []

    LoopTokens: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
      const token = this.tokens[this.tokenIndex]
      this.countTokensParsed = this.tokenIndex + 1

      if (UntilTokenType && token instanceof UntilTokenType) {
        this.result = {
          countTokensParsed: this.countTokensParsed,
          nodes: combineConsecutivePlainTextNodes(nodes),
          isMissingTerminator: false
        }

        return
      }

      if (token instanceof PlainTextToken) {
        if (!token.text) {
          continue
        }

        nodes.push(new PlainTextNode(token.text))
        continue
      }

      if (token instanceof ParenthesizedStartToken) {
        const result = this.parse({
          UntilTokenType: ParenthesizedEndToken,
          isTerminatorOptional: true
        })

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
        const result = this.parse({
          UntilTokenType: SquareBracketedEndToken,
          isTerminatorOptional: true
        })

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
        const result = this.parse({ UntilTokenType: LinkEndToken })

        let contents = result.nodes
        const hasContents = isNotPureWhitespace(contents)

        // The URL was in the LinkEndToken, the last token we parsed
        //
        // TODO: Move URL to LinkStartToken?
        const linkEndToken = <LinkEndToken>this.tokens[this.tokenIndex]

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
          const result = this.parse({ UntilTokenType: richConvention.EndTokenType })

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

    this.result = {
      countTokensParsed: this.countTokensParsed,
      nodes: combineConsecutivePlainTextNodes(nodes),
      isMissingTerminator: wasTerminatorSpecified
    }
  }

  parse(
    args: {
      UntilTokenType: TokenType,
      isTerminatorOptional?: boolean
    }
  ): ParseResult {
    const { UntilTokenType, isTerminatorOptional } = args
    
    const result = parse({
      tokens: this.tokens.slice(this.countTokensParsed),
      UntilTokenType,
      isTerminatorOptional
    })

    this.tokenIndex += result.countTokensParsed
    
    return result
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