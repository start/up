import { STRESS_CONVENTION, EMPHASIS_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, FOOTNOTE_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { isWhitespace } from '../../SyntaxNodes/isWhitespace'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { last } from '../../CollectionHelpers'
import { Token } from './Token'
import { TokenKind } from './TokenKind'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { RichConvention } from './RichConvention'


const RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES = [
  STRESS_CONVENTION,
  EMPHASIS_CONVENTION,
  REVISION_DELETION_CONVENTION,
  REVISION_INSERTION_CONVENTION,
  SPOILER_CONVENTION,
  FOOTNOTE_CONVENTION,
  ACTION_CONVENTION,
  PARENTHESIZED_CONVENTION,
  SQUARE_BRACKETED_CONVENTION
]

const MEDIA_CONVENTIONS = [
  AUDIO,
  IMAGE,
  VIDEO
]


export class Parser {
  result: ParseResult

  private tokens: Token[]
  private tokenIndex = 0
  private countTokensParsed = 0
  private nodes: InlineSyntaxNode[] = []


  constructor(args: { tokens: Token[], untilTokenKind?: TokenKind }) {
    const { untilTokenKind } = args
    this.tokens = args.tokens

    LoopTokens: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
      const token = this.tokens[this.tokenIndex]
      this.countTokensParsed = this.tokenIndex + 1

      if (token.kind === untilTokenKind) {
        this.setResult()
        return
      }

      if (token.kind === TokenKind.PlainText) {
        if (!token.value) {
          continue
        }

        this.nodes.push(new PlainTextNode(token.value))
        continue
      }

      if (token.kind === TokenKind.InlineCode) {
        // Empty inline code isn't meaningful, so we discard it
        if (token.value) {
          this.nodes.push(new InlineCodeNode(token.value))
        }

        continue
      }

      if (token.kind === TokenKind.NakedUrlSchemeAndStart) {
        const urlScheme = token.value

        // The next token will be a TokenKind.NakedUrlAfterSchemeAndEnd
        const nakedUrlAfterSchemeToken = this.getNextTokenAndAdvanceIndex()
        const urlAfterScheme = nakedUrlAfterSchemeToken.value

        if (!urlAfterScheme) {
          // There's no point in creating a link for a URL scheme alone, so we treat the scheme as plain text.
          this.nodes.push(new PlainTextNode(urlScheme))
          continue
        }

        const url = urlScheme + urlAfterScheme

        const contents = [new PlainTextNode(urlAfterScheme)]
        this.nodes.push(new LinkNode(contents, url))

        continue
      }

      if (token.kind === TokenKind.LinkStart) {
        const result = this.parse({ untilTokenKind: TokenKind.LinkUrlAndEnd })

        let contents = result.nodes
        const hasContents = isNotPureWhitespace(contents)

        // The URL was in the LinkUrlAndEnd token, the last token we parsed
        const linkUrlAndEndToken = this.tokens[this.tokenIndex]

        let url = linkUrlAndEndToken.value.trim()
        const hasUrl = !!url

        if (!hasContents && !hasUrl) {
          // If there's no content and no URL, there's nothing meaninful to include in the document
          continue
        }

        if (hasContents && !hasUrl) {
          // If there's content but no URL, we include the content directly in the document without producing
          // a link node
          this.nodes.push(...contents)
          continue
        }

        if (!hasContents && hasUrl) {
          // If there's no content but we have a URL, we'll use the URL for the content
          contents = [new PlainTextNode(url)]
        }

        this.nodes.push(new LinkNode(contents, url))
        continue
      }


      for (const media of MEDIA_CONVENTIONS) {
        if (token.kind === media.descriptionAndStartTokenKind) {
          let description = token.value.trim()

          // The next token will be a MediaUrlAndEnd token.
          let url = this.getNextTokenAndAdvanceIndex().value.trim()

          if (!url) {
            // If there's no URL, there's nothing meaningful to include in the document
            continue LoopTokens
          }

          if (!description) {
            // If there's no description, we treat the URL as the description
            description = url
          }

          this.nodes.push(new media.NodeType(description, url))
          continue LoopTokens
        }
      }

      for (const richConvention of RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES) {
        if (token.kind === richConvention.startTokenKind) {
          const result = this.parse({ untilTokenKind: richConvention.endTokenKind })

          if (result.nodes.length) {
            // Like empty inline code, we discard any empty sandwich convention
            this.nodes.push(new richConvention.NodeType(result.nodes))
          }

          continue LoopTokens
        }
      }
    }

    const wasTerminatorSpecified = !!untilTokenKind

    if (wasTerminatorSpecified) {
      throw new Error(`Missing terminator token: ${untilTokenKind}`)
    }

    this.setResult()
  }

  private getNextTokenAndAdvanceIndex(): Token {
    return this.tokens[++this.tokenIndex]
  }

  private parse(args: { untilTokenKind: TokenKind }): ParseResult {
    const { result } = new Parser({
      tokens: this.tokens.slice(this.countTokensParsed),
      untilTokenKind: args.untilTokenKind
    })

    this.tokenIndex += result.countTokensParsed
    return result
  }

  private setResult(): void {
    this.result = {
      countTokensParsed: this.countTokensParsed,
      nodes: combineConsecutivePlainTextNodes(this.nodes),
    }
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



interface ParseResult {
  nodes: InlineSyntaxNode[]
  countTokensParsed: number
}