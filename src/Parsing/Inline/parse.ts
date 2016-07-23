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
import { RevealableConvention } from './RevealableConvention'


// Returns a collection of inline syntax nodes representing inline conventions.
export function parse(tokens: Token[]): InlineSyntaxNode[] {
  return new Parser({
    tokens,
    inlineRevealableAncestorConventions: []
  }).result.nodes
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
  result: {
    nodes: InlineSyntaxNode[]
    countTokensParsed: number
  }

  private tokens: Token[]
  private revealableAncestorConventions: RevealableConvention[]
  private tokenIndex = 0
  private countTokensParsed = 0
  private nodes: InlineSyntaxNode[] = []

  constructor(
    args: {
      tokens: Token[]
      until?: TokenKind
      inlineRevealableAncestorConventions: RevealableConvention[]
    }
  ) {
    this.tokens = args.tokens
    this.revealableAncestorConventions = args.inlineRevealableAncestorConventions
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
          this.nodes.push(new PlainTextNode(token.value))
          continue
        }

        case TokenKind.Code: {
          this.nodes.push(new InlineCodeNode(token.value))
          continue
        }

        case TokenKind.NakedUrlScheme: {
          const urlScheme = token.value

          // The next token will be a TokenKind.NakedUrlAfterScheme
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
          let children = this.getNodes({ fromHereUntil: TokenKind.LinkEndAndUrl })

          const isContentBlank = isBlank(children)

          // The URL was in the LinkEndAndUrl token, the last token we parsed
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
            revealableParentConvention: (richConvention instanceof RevealableConvention) ? richConvention : null
          })

          // If this is a footnote convention, and if it's inside any revealable inline conventions...
          if ((richConvention === FOOTNOTE_CONVENTION) && this.revealableAncestorConventions.length) {
            // ... then we'll put the footnote's children directly inside the syntax node representing the
            // footnote's closeset revealable ancestor.
            //
            // This way, the content of the footnote within its footnote block remains revealable.
            //
            // Any footnotes within revealable *outline* conventions are placed into a footnote block inside
            // the revealable outline convention. This serves the same purpose. 
            const closestRevealableAncestorConvention = last(this.revealableAncestorConventions)
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
      nodes: combineConsecutivePlainTextNodes(this.nodes)
    }
  }

  private getNextTokenAndAdvanceIndex(): Token {
    return this.tokens[++this.tokenIndex]
  }

  private getNodes(
    args: {
      fromHereUntil: TokenKind
      revealableParentConvention?: RevealableConvention
    }
  ): InlineSyntaxNode[] {
    const { revealableParentConvention } = args

    let outerRevealableConventions =
      revealableParentConvention
        ? this.revealableAncestorConventions.concat(revealableParentConvention)
        : this.revealableAncestorConventions

    const { result } = new Parser({
      tokens: this.tokens.slice(this.countTokensParsed),
      until: args.fromHereUntil,
      inlineRevealableAncestorConventions: outerRevealableConventions
    })

    this.tokenIndex += result.countTokensParsed
    return result.nodes
  }
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
