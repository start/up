import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { Italics } from '../../SyntaxNodes/Italics'
import { Bold } from '../../SyntaxNodes/Bold'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineRevealable } from '../../SyntaxNodes/InlineRevealable'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { Link } from '../../SyntaxNodes/Link'
import { TokenRole } from './TokenRole'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'
import { RevealableConvention } from './RevealableConvention'


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

export const ITALICS: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Italics,
  startTokenRole: TokenRole.ItalicsStart,
  endTokenRole: TokenRole.ItalicsEnd
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

export const QUOTE: RichConventionWithoutExtraFields = {
  SyntaxNodeType: InlineQuote,
  startTokenRole: TokenRole.QuoteStart,
  endTokenRole: TokenRole.QuoteEnd
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

// The link convention has an extra field: its URL. Therefore, it doesn't satisfy the
// `RichConventionWithoutExtraFields` interface.
export const LINK = {
  SyntaxNodeType: Link,
  startTokenRole: TokenRole.LinkStart,
  endTokenRole: TokenRole.LinkEndAndUrl
}

export const REVEALABLE = new RevealableConvention({
  SyntaxNodeType: InlineRevealable,
  startTokenRole: TokenRole.RevealableStart,
  endTokenRole: TokenRole.RevealableEnd
})
