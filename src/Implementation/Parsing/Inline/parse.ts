import { last } from '../../CollectionHelpers'
import { URL_SCHEME_PATTERN } from '../../Patterns'
import { ExampleUserInput } from '../../SyntaxNodes/ExampleUserInput'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Link } from '../../SyntaxNodes/Link'
import { SectionLink } from '../../SyntaxNodes/SectionLink'
import { Text } from '../../SyntaxNodes/Text'
import { isWhitespace } from '../isWhitespace'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { ParseableToken } from './ParseableToken'
import { BOLD, EMPHASIS, FOOTNOTE, HIGHLIGHT, INLINE_QUOTE, INLINE_REVEALABLE, ITALIC, LINK, NORMAL_PARENTHETICAL, SQUARE_PARENTHETICAL, STRESS } from './RichConventions'
import { TokenRole } from './TokenRole'


// Returns a collection of inline syntax nodes representing inline conventions.
export function parse(tokens: ParseableToken[]): InlineSyntaxNode[] {
  return parseAndGetResult({ tokens }).nodes
}


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
  const nodes: InlineSyntaxNode[] = []

  const countTokensParsed = () => tokenIndex + 1

  function consumeChildren(args: { fromHereUntil: TokenRole }): InlineSyntaxNode[] {
    const result = parseAndGetResult({
      tokens: tokens.slice(countTokensParsed()),
      until: args.fromHereUntil
    })

    tokenIndex += result.countTokensParsed
    return result.nodes
  }

  TokenLoop: for (; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]

    // Not all tokens have a value, so the `value` field of `ParseableToken` can
    // be undefined. However, tokens of certain `role`s will never have always
    // have a value, which we rely upon below.
    const tokenValue = token.value!

    switch (token.role) {
      case until: 
        break TokenLoop

      case TokenRole.Text:
        nodes.push(new Text(tokenValue))
        continue

      case TokenRole.InlineCode:
        nodes.push(new InlineCode(tokenValue))
        continue

      case TokenRole.ExampleUserInput:
        nodes.push(new ExampleUserInput(tokenValue))
        continue

      case TokenRole.SectionLink:
        nodes.push(new SectionLink(tokenValue))
        continue

      case TokenRole.BareUrl: {
        const url = tokenValue

        const [urlScheme] = URL_SCHEME_PATTERN.exec(url)!
        const urlAfterScheme = url.substr(urlScheme.length)

        nodes.push(new LINK.SyntaxNodeType([new Text(urlAfterScheme)], url))

        continue
      }

      case LINK.startTokenRole: {
        let children = consumeChildren({
          fromHereUntil: TokenRole.LinkEndAndUrl
        })

        // Our link's URL was in the `LinkEndAndUrl `token, the last token we parsed.
        const url = (tokens[tokenIndex].value!).trim()

        if (children.every(isWhitespace)) {
          // As a rule, if link has blank content, we use its URL as its content.
          children = [new Text(url)]
        }

        nodes.push(new Link(children, url))
        continue
      }
    }

    for (const media of [AUDIO, IMAGE, VIDEO]) {
      if (token.role === media.tokenRoleForStartAndDescription) {
        const description = tokenValue.trim()

        // The next token will always be a `MediaEndAndUrl` token. All media conventions
        // use the same role for their end tokens.
        const urlToken = tokens[++tokenIndex]
        const url = urlToken.value!.trim()

        nodes.push(new media.SyntaxNodeType(description || url, url))
        continue TokenLoop
      }
    }

    for (const richConvention of [
      EMPHASIS,
      STRESS,
      ITALIC,
      BOLD,
      HIGHLIGHT,
      INLINE_REVEALABLE,
      FOOTNOTE,
      NORMAL_PARENTHETICAL,
      SQUARE_PARENTHETICAL,
      INLINE_QUOTE
    ]) {
      if (token.role === richConvention.startTokenRole) {
        const children = consumeChildren({
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
    countTokensParsed: countTokensParsed()
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
