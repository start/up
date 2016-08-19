import { LINK_CONVENTION, EMPHASIS_CONVENTION, STRESS_CONVENTION, ITALIC_CONVENTION, BOLD_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, HIGHLIGHT_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, PARENTHETICAL_CONVENTION, SQUARE_BRACKET_PARENTHETICAL_CONVENTION } from './RichConventions'
import { AUDIO_CONVENTION, IMAGE_CONVENTION, VIDEO_CONVENTION } from './MediaConventions'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { isWhitespace } from '../isWhitespace'
import { last } from '../../CollectionHelpers'
import { Token } from './Tokenization/Token'
import { TokenKind } from './Tokenization/TokenKind'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { ExampleInput } from '../../SyntaxNodes/ExampleInput'
import { InternalReference } from '../../SyntaxNodes/InternalReference'
import { Link } from '../../SyntaxNodes/Link'
import { RevealableConvention } from './RevealableConvention'


// Returns a collection of inline syntax nodes representing inline conventions.
export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return new Parser({
    tokens,
    ancestorRevealableInlineConventions: []
  }).result.nodes
}


// This includes every rich convention except for links. Links have that pesky URL.
const RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS = [
  EMPHASIS_CONVENTION,
  STRESS_CONVENTION,
  ITALIC_CONVENTION,
  BOLD_CONVENTION,
  HIGHLIGHT_CONVENTION,
  REVISION_DELETION_CONVENTION,
  REVISION_INSERTION_CONVENTION,
  SPOILER_CONVENTION,
  NSFW_CONVENTION,
  NSFL_CONVENTION,
  FOOTNOTE_CONVENTION,
  PARENTHETICAL_CONVENTION,
  SQUARE_BRACKET_PARENTHETICAL_CONVENTION
]

const MEDIA_CONVENTIONS = [
  AUDIO_CONVENTION,
  IMAGE_CONVENTION,
  VIDEO_CONVENTION
]


class Parser {
  result: {
    nodes: InlineSyntaxNode[]
    countTokensParsed: number
  }

  private tokens: Token[]
  private ancestorRevealableInlineConventions: RevealableConvention[]
  private tokenIndex = 0
  private countTokensParsed = 0
  private nodes: InlineSyntaxNode[] = []

  constructor(
    args: {
      tokens: Token[]
      until?: TokenKind
      ancestorRevealableInlineConventions: RevealableConvention[]
    }
  ) {
    this.tokens = args.tokens
    this.ancestorRevealableInlineConventions = args.ancestorRevealableInlineConventions
    const endTokenKind = args.until

    TokenLoop: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
      const token = this.tokens[this.tokenIndex]
      this.countTokensParsed = this.tokenIndex + 1

      switch (token.kind) {
        case endTokenKind: {
          this.setResult()
          return
        }

        case TokenKind.PlainText: {
          this.nodes.push(new PlainText(token.value))
          continue
        }

        case TokenKind.Code: {
          this.nodes.push(new InlineCode(token.value))
          continue
        }

        case TokenKind.ExampleInput: {
          this.nodes.push(new ExampleInput(token.value))
          continue
        }

        case TokenKind.InternalReference: {
          this.nodes.push(new InternalReference(token.value))
          continue
        }

        case TokenKind.NakedUrlScheme: {
          const urlScheme = token.value

          // The next token will be a TokenKind.NakedUrlAfterScheme
          const nakedUrlAfterSchemeToken = this.getNextTokenAndAdvanceIndex()
          const urlAfterScheme = nakedUrlAfterSchemeToken.value

          if (!urlAfterScheme) {
            // There's no point in creating a link for a URL scheme alone, so we treat the scheme as plain text
            this.nodes.push(new PlainText(urlScheme))
            continue
          }

          const url = urlScheme + urlAfterScheme

          this.nodes.push(
            new LINK_CONVENTION.NodeType([new PlainText(urlAfterScheme)], url))

          continue
        }

        case LINK_CONVENTION.startTokenKind: {
          let children = this.getNodes({ fromHereUntil: TokenKind.LinkEndAndUrl })

          const isContentBlank = isBlank(children)

          // The URL was in the LinkEndAndUrl token, the last token we parsed
          let url = this.tokens[this.tokenIndex].value.trim()

          if (isContentBlank) {
            // If the link has blank content, we use the URL for the content
            children = [new PlainText(url)]
          }

          this.nodes.push(new Link(children, url))
          continue
        }
      }

      for (const media of MEDIA_CONVENTIONS) {
        if (token.kind === media.startAndDescriptionTokenKind) {
          let description = token.value.trim()

          // The next token will be a MediaEndAndUrl token
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
          let children = this.getNodes({
            fromHereUntil: richConvention.endTokenKind,
            parentRevealableInlineConvention: (richConvention instanceof RevealableConvention) ? richConvention : null
          })

          if ((richConvention === FOOTNOTE_CONVENTION) && this.ancestorRevealableInlineConventions.length) {
            // Okay, we're dealing with a footnote that is within a revealable inline convention.
            //
            // To prevent this footnote's contents from being exposed within its footnote block, we put its
            // children directly inside the syntax node representing its closest revealable ancestor. This
            // stays true to the markup author's original intent.
            //
            // On a side note, any footnotes within revealable *outline* conventions are placed into a footnote
            // block inside the revealable outline convention. This serves the same purpose. 
            const closestRevealableAncestorConvention = last(this.ancestorRevealableInlineConventions)
            children = [new closestRevealableAncestorConvention.NodeType(children)]
          }

          this.nodes.push(new richConvention.NodeType(children))
          continue TokenLoop
        }
      }
    }

    this.setResult()
  }

  private setResult(): void {
    this.result = {
      countTokensParsed: this.countTokensParsed,
      nodes: combineConsecutivePlainTexts(this.nodes)
    }
  }

  private getNextTokenAndAdvanceIndex(): Token {
    return this.tokens[++this.tokenIndex]
  }

  private getNodes(
    args: {
      fromHereUntil: TokenKind
      parentRevealableInlineConvention?: RevealableConvention
    }
  ): InlineSyntaxNode[] {
    const { parentRevealableInlineConvention } = args

    let outerRevealableConventions =
      parentRevealableInlineConvention
        ? this.ancestorRevealableInlineConventions.concat(parentRevealableInlineConvention)
        : this.ancestorRevealableInlineConventions

    const { result } = new Parser({
      tokens: this.tokens.slice(this.countTokensParsed),
      until: args.fromHereUntil,
      ancestorRevealableInlineConventions: outerRevealableConventions,
    })

    this.tokenIndex += result.countTokensParsed
    return result.nodes
  }
}


function isBlank(nodes: InlineSyntaxNode[]): boolean {
  return nodes.every(isWhitespace)
}

function combineConsecutivePlainTexts(nodes: InlineSyntaxNode[]): InlineSyntaxNode[] {
  const resultNodes: InlineSyntaxNode[] = []

  for (const node of nodes) {
    const lastNode = last(resultNodes)

    if ((node instanceof PlainText) && (lastNode instanceof PlainText)) {
      lastNode.content += node.content
      continue
    }

    resultNodes.push(node)
  }

  return resultNodes
}
