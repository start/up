import { Bold } from '../../SyntaxNodes/Bold'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
import { InlineRevealable } from '../../SyntaxNodes/InlineRevealable'
import { Italic } from '../../SyntaxNodes/Italic'
import { Link } from '../../SyntaxNodes/Link'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { Stress } from '../../SyntaxNodes/Stress'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'
import { TokenRole } from './TokenRole'


export const EMPHASIS: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Emphasis,
  startTokenRole: TokenRole.EmphasisStart,
  endTokenRole: TokenRole.EmphasisEnd
}

export const STRESS: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Stress,
  startTokenRole: TokenRole.StressStart,
  endTokenRole: TokenRole.StressEnd
}

export const ITALIC: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Italic,
  startTokenRole: TokenRole.ItalicStart,
  endTokenRole: TokenRole.ItalicEnd
}

export const BOLD: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Bold,
  startTokenRole: TokenRole.BoldStart,
  endTokenRole: TokenRole.BoldEnd
}

export const HIGHLIGHT: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Highlight,
  startTokenRole: TokenRole.HighlightStart,
  endTokenRole: TokenRole.HighlightEnd
}

export const INLINE_QUOTE: RichConventionWithoutExtraFields = {
  SyntaxNodeType: InlineQuote,
  startTokenRole: TokenRole.InlineQuoteStart,
  endTokenRole: TokenRole.InlineQuoteEnd
}

export const FOOTNOTE: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Footnote,
  startTokenRole: TokenRole.FootnoteStart,
  endTokenRole: TokenRole.FootnoteEnd
}

export const NORMAL_PARENTHETICAL: RichConventionWithoutExtraFields = {
  SyntaxNodeType: NormalParenthetical,
  startTokenRole: TokenRole.NormalParentheticalStart,
  endTokenRole: TokenRole.NormalParentheticalEnd
}

export const SQUARE_PARENTHETICAL: RichConventionWithoutExtraFields = {
  SyntaxNodeType: SquareParenthetical,
  startTokenRole: TokenRole.SquareParentheticalStart,
  endTokenRole: TokenRole.SquareParentheticalEnd
}

export const INLINE_REVEALABLE: RichConventionWithoutExtraFields = {
  SyntaxNodeType: InlineRevealable,
  startTokenRole: TokenRole.InlineRevealableStart,
  endTokenRole: TokenRole.InlineRevealableEnd
}

// The link convention has an extra field: its URL. Therefore, it doesn't satisfy the
// `RichConventionWithoutExtraFields` interface.
export const LINK = {
  SyntaxNodeType: Link,
  startTokenRole: TokenRole.LinkStart,
  endTokenRole: TokenRole.LinkEndAndUrl
}
