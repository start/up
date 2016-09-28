import { LINK, EMPHASIS, STRESS, ITALICS, BOLD, HIGHLIGHT, INLINE_QUOTE, INLINE_REVEALABLE, FOOTNOTE, NORMAL_PARENTHETICAL, SQUARE_PARENTHETICAL } from './RichConventions'
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
import { URL_SCHEME_PATTERN } from '../../Patterns'


// Returns a collection of inline syntax nodes representing inline conventions.
export function parse(tokens: ParseableToken[]): InlineSyntaxNode[] {
  return new Parser({ tokens }).result.nodes
}


// This includes every rich convention except for links. Links have that pesky URL.
const RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS = [
  EMPHASIS,
  STRESS,
  ITALICS,
  BOLD,
  HIGHLIGHT,
  INLINE_REVEALABLE,
  FOOTNOTE,
  NORMAL_PARENTHETICAL,
  SQUARE_PARENTHETICAL,
  INLINE_QUOTE
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
  private tokenIndex = 0
  private countTokensParsed = 0
  private inlineSyntaxNodes: InlineSyntaxNode[] = []

  constructor(
    args: { tokens: ParseableToken[], until?: TokenRole }) {
    this.tokens = args.tokens
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
          this.inlineSyntaxNodes.push(new Text(token.value))
          continue
        }

        case TokenRole.InlineCode: {
          this.inlineSyntaxNodes.push(new InlineCode(token.value))
          continue
        }

        case TokenRole.ExampleInput: {
          this.inlineSyntaxNodes.push(new ExampleInput(token.value))
          continue
        }

        case TokenRole.SectionLink: {
          this.inlineSyntaxNodes.push(new SectionLink(token.value))
          continue
        }

        case TokenRole.BareUrl: {
          const url = token.value

          const [urlScheme] = URL_SCHEME_PATTERN.exec(url)
          const urlAfterScheme = url.substr(urlScheme.length)

          this.inlineSyntaxNodes.push(
            new LINK.SyntaxNodeType([new Text(urlAfterScheme)], url))

          continue
        }

        case LINK.startTokenRole: {
          let children = this.getInlineSyntaxNodes({
            fromHereUntil: TokenRole.LinkEndAndUrl
          })

          const isContentBlank = isBlank(children)

          // The URL was in the LinkEndAndUrl token, the last token we parsed
          let url = this.tokens[this.tokenIndex].value.trim()

          if (isContentBlank) {
            // As a rule, if link has blank content, we use its URL as its content
            children = [new Text(url)]
          }

          this.inlineSyntaxNodes.push(new Link(children, url))
          continue
        }
      }

      for (const media of MEDIA_CONVENTIONS) {
        if (token.role === media.tokenRoleForStartAndDescription) {
          let description = token.value.trim()

          // The next token will be a MediaEndAndUrl token. All media conventions
          // use the same role for their end tokens.
          let url = this.getNextTokenAndAdvanceIndex().value.trim()

          this.inlineSyntaxNodes.push(new media.SyntaxNodeType(description, url))
          continue TokenLoop
        }
      }

      for (const richConvention of RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS) {
        if (token.role === richConvention.startTokenRole) {
          let children = this.getInlineSyntaxNodes({
            fromHereUntil: richConvention.endTokenRole
          })

          this.inlineSyntaxNodes.push(new richConvention.SyntaxNodeType(children))
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
      nodes: combineConsecutiveTextNodes(this.inlineSyntaxNodes)
    }
  }

  private getNextTokenAndAdvanceIndex(): ParseableToken {
    return this.tokens[++this.tokenIndex]
  }

  private getInlineSyntaxNodes(args: { fromHereUntil: TokenRole }): InlineSyntaxNode[] {
    const { result } = new Parser({
      tokens: this.tokens.slice(this.countTokensParsed),
      until: args.fromHereUntil
    })

    this.tokenIndex += result.countTokensParsed
    return result.nodes
  }
}


function isBlank(nodes: InlineSyntaxNode[]): boolean {
  return nodes.every(isWhitespace)
}

function combineConsecutiveTextNodes(nodes: InlineSyntaxNode[]): InlineSyntaxNode[] {
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
