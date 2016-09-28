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
  return parseAndGetResult({ tokens }).nodes
}


// This includes every rich convention except for links, because links have a URL.
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


interface ParseResult {
  nodes: InlineSyntaxNode[]
  countTokensParsed: number
}


function parseAndGetResult(
  args: {
    tokens: ParseableToken[],
    until?: TokenRole
  }
): ParseResult {
  const { tokens, until } = args

  let tokenIndex = 0
  let nodes: InlineSyntaxNode[] = []

  function getCountTokensParsed(): number {
    return tokenIndex + 1
  }

  function getChildren(args: { fromHereUntil: TokenRole }): InlineSyntaxNode[] {
    const result = parseAndGetResult({
      tokens: tokens.slice(getCountTokensParsed()),
      until: args.fromHereUntil
    })

    tokenIndex += result.countTokensParsed
    return result.nodes
  }

  TokenLoop: for (; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]

    switch (token.role) {
      case until: {
        break TokenLoop
      }

      case TokenRole.Text: {
        nodes.push(new Text(token.value))
        continue
      }

      case TokenRole.InlineCode: {
        nodes.push(new InlineCode(token.value))
        continue
      }

      case TokenRole.ExampleInput: {
        nodes.push(new ExampleInput(token.value))
        continue
      }

      case TokenRole.SectionLink: {
        nodes.push(new SectionLink(token.value))
        continue
      }

      case TokenRole.BareUrl: {
        const url = token.value

        const [urlScheme] = URL_SCHEME_PATTERN.exec(url)
        const urlAfterScheme = url.substr(urlScheme.length)

        nodes.push(new LINK.SyntaxNodeType([new Text(urlAfterScheme)], url))

        continue
      }

      case LINK.startTokenRole: {
        let children = getChildren({
          fromHereUntil: TokenRole.LinkEndAndUrl
        })

        // Our link's URL was in the `LinkEndAndUrl `token, the last token we parsed.
        let url = tokens[tokenIndex].value.trim()

        if (children.every(isWhitespace)) {
          // As a rule, if link has blank content, we use its URL as its content.
          children = [new Text(url)]
        }

        nodes.push(new Link(children, url))
        continue
      }
    }

    for (const media of MEDIA_CONVENTIONS) {
      if (token.role === media.tokenRoleForStartAndDescription) {
        let description = token.value.trim()

        // The next token will always be a `MediaEndAndUrl` token. All media conventions
        // use the same role for their end tokens.
        const urlToken = tokens[++tokenIndex]
        let url = urlToken.value.trim()

        nodes.push(new media.SyntaxNodeType(description, url))
        continue TokenLoop
      }
    }

    for (const richConvention of RICH_CONVENTIONS_WITHOUT_EXTRA_FIELDS) {
      if (token.role === richConvention.startTokenRole) {
        let children = getChildren({
          fromHereUntil: richConvention.endTokenRole
        })

        nodes.push(new richConvention.SyntaxNodeType(children))
        continue TokenLoop
      }
    }

    throw new Error('Unrecognized token: ' + TokenRole[token.role])
  }

  return {
    nodes: combineConsecutiveTextNodes(nodes),
    countTokensParsed: getCountTokensParsed()
  }
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
