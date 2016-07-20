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
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


// Returns a collection of inline syntax nodes representing inline conventions.
export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return new Parser({ tokens }).result.nodes
}


// This includes every rich convention except for links. Links have that pesky URL.
const RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS = [
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
          this.nodes.push(new PlainTextNode(token.value))
          continue
        }

        case TokenKind.Code: {
          this.nodes.push(new InlineCodeNode(token.value))
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

          this.nodes.push(
            new LINK_CONVENTION.NodeType([new PlainTextNode(urlAfterScheme)], url))

          continue
        }

        case LINK_CONVENTION.startTokenKind: {
          let children = this.produceSyntaxNodes({ fromHereUntil: TokenKind.LinkUrlAndEnd })

          const isContentBlank = isBlank(children)

          // The URL was in the LinkUrlAndEnd token, the last token we parsed
          let url = this.tokens[this.tokenIndex].value.trim()

          if (isContentBlank) {
            // If the link has blank content, we use the URL for the content
            children = [new PlainTextNode(url)]
          }

          this.nodes.push(new LinkNode(children, url))
          continue
        }
      }

      for (const media of MEDIA_CONVENTIONS) {
        if (token.kind === media.descriptionAndStartTokenKind) {
          let description = token.value.trim()

          // The next token will be a MediaUrlAndEnd token
          let url = this.getNextTokenAndAdvanceIndex().value.trim()

          if (!description) {
            // If there's no description, we treat the URL as the description
            description = url
          }

          this.nodes.push(new media.NodeType(description, url))
          continue TokenLoop
        }
      }

      for (const richConvention of RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS) {
        if (token.kind === richConvention.startTokenKind) {
          const children =
            this.produceSyntaxNodes({ fromHereUntil: richConvention.endTokenKind })

          this.nodes.push(new richConvention.NodeType(children))
          continue TokenLoop
        }
      }
    }

    if (untilTokenOfKind) {
      throw new Error('Missing terminator token: ' + TokenKind[untilTokenOfKind])
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
