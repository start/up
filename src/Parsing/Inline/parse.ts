import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE, PARENTHESIZED, SQUARE_BRACKETED, ACTION } from './RichConventions'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { isWhitespace } from '../../SyntaxNodes/isWhitespace'
import { RichInlineSyntaxNode } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { last } from '../../CollectionHelpers'
import { ParenthesizedStartToken } from './Tokens/ParenthesizedStartToken'
import { ParenthesizedEndToken } from './Tokens/ParenthesizedEndToken'
import { SquareBracketedStartToken } from './Tokens/SquareBracketedStartToken'
import { SquareBracketedEndToken } from './Tokens/SquareBracketedEndToken'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { MediaDescriptionToken } from './Tokens/MediaDescriptionToken'
import { MediaEndToken } from './Tokens/MediaEndToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { Token } from './Tokens/Token'
import { TokenType } from './Tokens/TokenType'
import { NakedUrlToken } from './Tokens/NakedUrlToken'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { RichConvention } from './RichConvention'
import { ParseResult } from './ParseResult'


export function parse(args: ParseArgs): ParseResult {
  return new Parser(args).result
}


const RICH_CONVENTIONS_WITHOUT_SPECIAL_ATTRIBUTES = [
  STRESS,
  EMPHASIS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE,
  ACTION
]

const MEDIA_CONVENTIONS = [
  AUDIO,
  IMAGE,
  VIDEO
]

const BRACKET_CONVENTIONS = [
  PARENTHESIZED,
  SQUARE_BRACKETED,
]


interface ParseArgs {
  tokens: Token[],
  UntilTokenType?: TokenType,
  isTerminatorOptional?: boolean
}


class Parser {
  result: ParseResult

  private tokens: Token[]
  private tokenIndex = 0
  private countTokensParsed = 0
  private nodes: InlineSyntaxNode[] = []


  constructor(args: ParseArgs) {
    const { UntilTokenType, isTerminatorOptional } = args
    this.tokens = args.tokens

    LoopTokens: for (; this.tokenIndex < this.tokens.length; this.tokenIndex++) {
      const token = this.tokens[this.tokenIndex]
      this.countTokensParsed = this.tokenIndex + 1

      if (UntilTokenType && token instanceof UntilTokenType) {
        this.setResult({ isMissingTerminator: false })
        return
      }

      if (token instanceof PlainTextToken) {
        if (!token.text) {
          continue
        }

        this.nodes.push(new PlainTextNode(token.text))
        continue
      }
      
      for (const bracketed of BRACKET_CONVENTIONS) {
        if (token instanceof bracketed.StartTokenType) {
          this.parseBracket(bracketed)
        }
      }

      if (token instanceof InlineCodeToken) {
        // Empty inline code isn't meaningful, so we discard it
        if (token.code) {
          this.nodes.push(new InlineCodeNode(token.code))
        }

        continue
      }

      if (token instanceof NakedUrlToken) {
        if (!token.urlAfterProtocol) {          
          // As a rule, naked URLs consisting only of a protocol are treated as plain text.
          this.nodes.push(new PlainTextNode(token.url()))
          continue
        }
        
        const contents = [new PlainTextNode(token.urlAfterProtocol)]
        this.nodes.push(new LinkNode(contents, token.url()))

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
        if (token instanceof media.StartTokenType) {
          // The next token will be a media description token...
          let descriptionToken = <MediaDescriptionToken>this.advanceToNextToken()
          
          // ... And the next token will be a media end token!
          let mediaEndToken = <MediaEndToken>this.advanceToNextToken()
          
          // Alright. Now we can start producing our media syntax node.
          
          let description = descriptionToken.description.trim()
          const url = mediaEndToken.url.trim()

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
        if (token instanceof richConvention.StartTokenType) {
          const result = this.parse({ UntilTokenType: richConvention.EndTokenType })

          if (result.nodes.length) {
            // Like empty inline code, we discard any empty sandwich convention
            this.nodes.push(new richConvention.NodeType(result.nodes))
          }

          continue LoopTokens
        }
      }
    }
    
    const wasTerminatorSpecified = !!UntilTokenType

    if (!isTerminatorOptional && wasTerminatorSpecified) {
      throw new Error(`Missing terminator token: ${UntilTokenType}`)
    }

    this.setResult({ isMissingTerminator: wasTerminatorSpecified })
  }
  
  private advanceToNextToken(): Token {
    return this.tokens[this.tokenIndex++]
  }

  private parse(
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

  private parseBracket(bracketed: RichConvention): void {
    const result = this.parse({
      UntilTokenType: bracketed.EndTokenType,
      isTerminatorOptional: true
    })

    if (result.isMissingTerminator) {
      this.nodes.push(...result.nodes)
      return
    }
    
    this.nodes.push(new bracketed.NodeType(result.nodes))
  }
  
  private setResult(args: {isMissingTerminator: boolean}): void {
    this.result = {
      countTokensParsed: this.countTokensParsed,
      nodes: combineConsecutivePlainTextNodes(this.nodes),
      isMissingTerminator: args.isMissingTerminator
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
