import { LINK, EMPHASIS, STRESS, ITALIC, BOLD, HIGHLIGHT, QUOTE, SPOILER, NSFW, NSFL, FOOTNOTE, NORMAL_PARENTHETICAL, SQUARE_PARENTHETICAL } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Text } from '../../SyntaxNodes/Text'
import { isWhitespace } from '../isWhitespace'
import { last } from '../../CollectionHelpers'
import { ParseableToken } from './ParseableToken'
import { TokenRole } from './TokenRole'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { ExampleInput } from '../../SyntaxNodes/ExampleInput'
import { SectionLink } from '../../SyntaxNodes/SectionLink'
import { Link } from '../../SyntaxNodes/Link'
import { RevealableConvention } from './RevealableConvention'
import { URL_SCHEME_PATTERN } from '../../Patterns'


// Returns a collection of inline syntax nodes representing inline conventions.
export function parse(tokens: ParseableToken[]): InlineSyntaxNode[] {
  return new Parser({
    tokens,
    ancestorRevealableInlineConventions: []
  }).result.nodes
}


// This includes every rich convention except for links. Links have that pesky URL.
const RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS = [
  EMPHASIS,
  STRESS,
  ITALIC,
  BOLD,
  HIGHLIGHT,
  SPOILER,
  NSFW,
  NSFL,
  FOOTNOTE,
  NORMAL_PARENTHETICAL,
  SQUARE_PARENTHETICAL,
  QUOTE
]

const MEDIA_CONVENTIONS = [
  AUDIO,
  IMAGE,
  VIDEO
]


class Parser {
  result: {
    nodes: InlineSyntaxNode[]
    countTokensParsed: number
  }

  private tokens: ParseableToken[]
  private ancestorRevealableInlineConventions: RevealableConvention[]
  private tokenIndex = 0
  private countTokensParsed = 0
  private nodes: InlineSyntaxNode[] = []

  constructor(
    args: {
      tokens: ParseableToken[]
      until?: TokenRole
      ancestorRevealableInlineConventions: RevealableConvention[]
    }
  ) {
    this.tokens = args.tokens
    this.ancestorRevealableInlineConventions = args.ancestorRevealableInlineConventions
    const endTokenRole = args.until

    TokenLoop: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
      const token = this.tokens[this.tokenIndex]
      this.countTokensParsed = this.tokenIndex + 1

      switch (token.role) {
        case endTokenRole: {
          this.setResult()
          return
        }

        case TokenRole.Text: {
          this.nodes.push(new Text(token.value))
          continue
        }

        case TokenRole.Code: {
          this.nodes.push(new InlineCode(token.value))
          continue
        }

        case TokenRole.ExampleInput: {
          this.nodes.push(new ExampleInput(token.value))
          continue
        }

        case TokenRole.SectionLink: {
          this.nodes.push(new SectionLink(token.value))
          continue
        }

        case TokenRole.BareUrl: {
          const url = token.value

          const [urlScheme] = URL_SCHEME_PATTERN.exec(url)
          const urlAfterScheme = url.substr(urlScheme.length)

          this.nodes.push(
            new LINK.SyntaxNodeType([new Text(urlAfterScheme)], url))

          continue
        }

        case LINK.startTokenRole: {
          let children = this.getNodes({ fromHereUntil: TokenRole.LinkEndAndUrl })

          const isContentBlank = isBlank(children)

          // The URL was in the LinkEndAndUrl token, the last token we parsed
          let url = this.tokens[this.tokenIndex].value.trim()

          if (isContentBlank) {
            // If the link has blank content, we use the URL for the content
            children = [new Text(url)]
          }

          this.nodes.push(new Link(children, url))
          continue
        }
      }

      for (const media of MEDIA_CONVENTIONS) {
        if (token.role === media.startAndDescriptionTokenRole) {
          let description = token.value.trim()

          // The next token will be a MediaEndAndUrl token
          let url = this.getNextTokenAndAdvanceIndex().value.trim()

          this.nodes.push(new media.SyntaxNodeType(description, url))
          continue TokenLoop
        }
      }

      for (const richConvention of RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS) {
        if (token.role === richConvention.startTokenRole) {
          let children = this.getNodes({
            fromHereUntil: richConvention.endTokenRole,
            parentRevealableInlineConvention: (richConvention instanceof RevealableConvention) ? richConvention : null
          })

          if ((richConvention === FOOTNOTE) && this.ancestorRevealableInlineConventions.length) {
            // Okay, we're dealing with a footnote that is within a revealable inline convention.
            //
            // To prevent this footnote's contents from being exposed within its footnote block, we put its
            // children directly inside the syntax node representing its closest revealable ancestor. This
            // stays true to the markup author's original intent.
            //
            // On a side note, any footnotes within revealable *outline* conventions are placed into a footnote
            // block inside the revealable outline convention. This serves the same purpose. 
            const closestRevealableAncestorConvention = last(this.ancestorRevealableInlineConventions)
            children = [new closestRevealableAncestorConvention.SyntaxNodeType(children)]
          }

          this.nodes.push(new richConvention.SyntaxNodeType(children))
          continue TokenLoop
        }
      }

      throw new Error('Unrecognized token: ' + TokenRole[token.role])
    }

    this.setResult()
  }

  private setResult(): void {
    this.result = {
      countTokensParsed: this.countTokensParsed,
      nodes: combineConsecutivePlainTexts(this.nodes)
    }
  }

  private getNextTokenAndAdvanceIndex(): ParseableToken {
    return this.tokens[++this.tokenIndex]
  }

  private getNodes(
    args: {
      fromHereUntil: TokenRole
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
      ancestorRevealableInlineConventions: outerRevealableConventions
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

    if ((node instanceof Text) && (lastNode instanceof Text)) {
      lastNode.text += node.text
      continue
    }

    resultNodes.push(node)
  }

  return resultNodes
}
