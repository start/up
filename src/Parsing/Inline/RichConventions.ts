import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { Link } from '../../SyntaxNodes/Link'
import { TokenKind } from './Tokenizing/TokenKind'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'
import { RevealableConvention } from './RevealableConvention'


export const EMPHASIS: RichConventionWithoutExtraFields = {
  NodeType: Emphasis,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

export const STRESS: RichConventionWithoutExtraFields = {
  NodeType: Stress,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

export const ITALIC: RichConventionWithoutExtraFields = {
  NodeType: Italic,
  startTokenKind: TokenKind.ItalicStart,
  endTokenKind: TokenKind.ItalicEnd
}

export const BOLD: RichConventionWithoutExtraFields = {
  NodeType: Bold,
  startTokenKind: TokenKind.BoldStart,
  endTokenKind: TokenKind.BoldEnd
}

export const HIGHLIGHT: RichConventionWithoutExtraFields = {
  NodeType: Highlight,
  startTokenKind: TokenKind.HighlightStart,
  endTokenKind: TokenKind.HighlightEnd
}

export const QUOTE: RichConventionWithoutExtraFields = {
  NodeType: InlineQuote,
  startTokenKind: TokenKind.QuoteStart,
  endTokenKind: TokenKind.QuoteEnd
}

export const FOOTNOTE: RichConventionWithoutExtraFields = {
  NodeType: Footnote,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd
}

export const NORMAL_PARENTHETICAL: RichConventionWithoutExtraFields = {
  NodeType: NormalParenthetical,
  startTokenKind: TokenKind.NormalParentheticalStart,
  endTokenKind: TokenKind.NormalParentheticalEnd
}

export const SQUARE_PARENTHETICAL: RichConventionWithoutExtraFields = {
  NodeType: SquareParenthetical,
  startTokenKind: TokenKind.SquareParentheticalStart,
  endTokenKind: TokenKind.SquareParentheticalEnd
}

// The link convention has an extra field: its URL. Therefore, it doesn't satisfy the
// `RichConventionWithoutExtraFields` interface.
export const LINK = {
  NodeType: Link,
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkEndAndUrl
}

export const SPOILER = new RevealableConvention({
  NodeType: InlineSpoiler,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd
})

export const NSFW = new RevealableConvention({
  NodeType: InlineNsfw,
  startTokenKind: TokenKind.NsfwStart,
  endTokenKind: TokenKind.NsfwEnd
})

export const NSFL = new RevealableConvention({
  NodeType: InlineNsfl,
  startTokenKind: TokenKind.NsflStart,
  endTokenKind: TokenKind.NsflEnd
})
