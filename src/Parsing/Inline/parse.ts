import { LINK_CONVENTION, STRESS_CONVENTION, EMPHASIS_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from './RichConventions'
import { AUDIO_CONVENTION, IMAGE_CONVENTION, VIDEO_CONVENTION } from './MediaConventions'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { isWhitespace } from '../isWhitespace'
import { last } from '../../CollectionHelpers'
import { Token } from './Tokenization/Token'
import { TokenKind } from './Tokenization/TokenKind'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { RichConvention } from './RichConvention'


// Returns a collection of inline syntax nodes representing inline conventions.
export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return new Parser({ tokens }).result.nodes
}


// This includes every rich convention except for links, because links have that pesky URL to deal with.
const RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES: RichConvention[] = [
  STRESS_CONVENTION,
  EMPHASIS_CONVENTION,
  REVISION_DELETION_CONVENTION,
  REVISION_INSERTION_CONVENTION,
  SPOILER_CONVENTION,
  NSFW_CONVENTION,
  NSFL_CONVENTION,
  FOOTNOTE_CONVENTION,
  ACTION_CONVENTION,
  PARENTHESIZED_CONVENTION,
  SQUARE_BRACKETED_CONVENTION
]

const MEDIA_CONVENTIONS = [
  AUDIO_CONVENTION,
  IMAGE_CONVENTION,
  VIDEO_CONVENTION
]


class Parser {
  result: ParseResult

  private tokens: Token[]
  private tokenIndex = 0
  private countTokensParsed = 0
  private nodes: InlineSyntaxNode[] = []

  constructor(args: { tokens: Token[], untilTokenOfKind?: TokenKind }) {
    this.tokens = args.tokens
    const { untilTokenOfKind } = args

    TokenLoop: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
      const token = this.tokens[this.tokenIndex]
      this.countTokensParsed = this.tokenIndex + 1

      switch (token.kind) {
        case untilTokenOfKind: {
          this.setResult()
          return
        }

        case TokenKind.PlainText: {
          if (token.value) {
            this.nodes.push(new PlainTextNode(token.value))
          }

          continue
        }

        case TokenKind.InlineCode: {
          const code = token.value.trim()

          // Empty inline code isn't meaningful, so we discard it
          if (code) {
            this.nodes.push(new InlineCodeNode(code))
          }

          continue
        }

        case TokenKind.NakedUrlSchemeAndStart: {
          const urlScheme = token.value

          // The next token will be a TokenKind.NakedUrlAfterSchemeAndEnd
          const nakedUrlAfterSchemeToken = this.getNextTokenAndAdvanceIndex()
          const urlAfterScheme = nakedUrlAfterSchemeToken.value

          if (!urlAfterScheme) {
            // There's no point in creating a link for a URL scheme alone, so we treat the scheme as plain text
            this.nodes.push(new PlainTextNode(urlScheme))
            continue
          }

          const url = urlScheme + urlAfterScheme

          const contents = [new PlainTextNode(urlAfterScheme)]
          this.nodes.push(new LINK_CONVENTION.NodeType(contents, url))

          continue
        }

        case LINK_CONVENTION.startTokenKind: {
          let contentNodes = this.produceSyntaxNodes({ fromHereUntil: TokenKind.LinkUrlAndEnd })
          const isContentBlank = isBlank(contentNodes)

          // The URL was in the LinkUrlAndEnd token, the last token we parsed
          let url = this.tokens[this.tokenIndex].value.trim()

          if (url) {
            if (isContentBlank) {
              // If the link has a URL but no content, we use the URL for the content
              contentNodes = [new PlainTextNode(url)]
            }

            this.nodes.push(new LinkNode(contentNodes, url))
            continue
          }

          if (!isContentBlank) {
            // If the link has no URL but does have content, we include the content directly in the document
            // without putting it in a link node
            this.nodes.push(...contentNodes)
          }

          // If the link has no URL and no content, there's nothing meaninful to include in the document
          continue
        }
      }

      for (const media of MEDIA_CONVENTIONS) {
        if (token.kind === media.descriptionAndStartTokenKind) {
          let description = token.value.trim()

          // The next token will be a MediaUrlAndEnd token
          let url = this.getNextTokenAndAdvanceIndex().value.trim()

          if (!url) {
            // If there's no URL, there's nothing meaningful to include in the document
            continue TokenLoop
          }

          if (!description) {
            // If there's no description, we treat the URL as the description
            description = url
          }

          this.nodes.push(new media.NodeType(description, url))
          continue TokenLoop
        }
      }

      for (const richConvention of RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES) {
        if (token.kind === richConvention.startTokenKind) {
          const contentNodes = this.produceSyntaxNodes({ fromHereUntil: richConvention.endTokenKind })

          const includeConventionInDocument =
            contentNodes.length > 0
            && (richConvention.isMeaningfulEvenWhenContainingOnlyWhitespace || !isBlank(contentNodes))

          if (includeConventionInDocument) {
            this.nodes.push(new richConvention.NodeType(contentNodes))
          }

          continue TokenLoop
        }
      }
    }

    this.setResult()
  }

  private getNextTokenAndAdvanceIndex(): Token {
    return this.tokens[++this.tokenIndex]
  }

  private produceSyntaxNodes(args: { fromHereUntil: TokenKind }): InlineSyntaxNode[] {
    const { result } = new Parser({
      tokens: this.tokens.slice(this.countTokensParsed),
      untilTokenOfKind: args.fromHereUntil
    })

    this.tokenIndex += result.countTokensParsed
    return result.nodes
  }

  private setResult(): void {
    this.result = {
      countTokensParsed: this.countTokensParsed,
      nodes: combineConsecutivePlainTextNodes(this.nodes)
    }
  }
}


interface ParseResult {
  nodes: InlineSyntaxNode[]
  countTokensParsed: number
}


function isBlank(nodes: InlineSyntaxNode[]): boolean {
  return nodes.every(isWhitespace)
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
