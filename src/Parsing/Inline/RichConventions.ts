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
import { TokenMeaning } from './Tokenizing/TokenMeaning'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'
import { RevealableConvention } from './RevealableConvention'


export const EMPHASIS: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Emphasis,
  startTokenMeaning: TokenMeaning.EmphasisStart,
  endTokenMeaning: TokenMeaning.EmphasisEnd
}

export const STRESS: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Stress,
  startTokenMeaning: TokenMeaning.StressStart,
  endTokenMeaning: TokenMeaning.StressEnd
}

export const ITALIC: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Italic,
  startTokenMeaning: TokenMeaning.ItalicStart,
  endTokenMeaning: TokenMeaning.ItalicEnd
}

export const BOLD: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Bold,
  startTokenMeaning: TokenMeaning.BoldStart,
  endTokenMeaning: TokenMeaning.BoldEnd
}

export const HIGHLIGHT: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Highlight,
  startTokenMeaning: TokenMeaning.HighlightStart,
  endTokenMeaning: TokenMeaning.HighlightEnd
}

export const QUOTE: RichConventionWithoutExtraFields = {
  SyntaxNodeType: InlineQuote,
  startTokenMeaning: TokenMeaning.QuoteStart,
  endTokenMeaning: TokenMeaning.QuoteEnd
}

export const FOOTNOTE: RichConventionWithoutExtraFields = {
  SyntaxNodeType: Footnote,
  startTokenMeaning: TokenMeaning.FootnoteStart,
  endTokenMeaning: TokenMeaning.FootnoteEnd
}

export const NORMAL_PARENTHETICAL: RichConventionWithoutExtraFields = {
  SyntaxNodeType: NormalParenthetical,
  startTokenMeaning: TokenMeaning.NormalParentheticalStart,
  endTokenMeaning: TokenMeaning.NormalParentheticalEnd
}

export const SQUARE_PARENTHETICAL: RichConventionWithoutExtraFields = {
  SyntaxNodeType: SquareParenthetical,
  startTokenMeaning: TokenMeaning.SquareParentheticalStart,
  endTokenMeaning: TokenMeaning.SquareParentheticalEnd
}

// The link convention has an extra field: its URL. Therefore, it doesn't satisfy the
// `RichConventionWithoutExtraFields` interface.
export const LINK = {
  SyntaxNodeType: Link,
  startTokenMeaning: TokenMeaning.LinkStart,
  endTokenMeaning: TokenMeaning.LinkEndAndUrl
}

export const SPOILER = new RevealableConvention({
  SyntaxNodeType: InlineSpoiler,
  startTokenMeaning: TokenMeaning.SpoilerStart,
  endTokenMeaning: TokenMeaning.SpoilerEnd
})

export const NSFW = new RevealableConvention({
  SyntaxNodeType: InlineNsfw,
  startTokenMeaning: TokenMeaning.NsfwStart,
  endTokenMeaning: TokenMeaning.NsfwEnd
})

export const NSFL = new RevealableConvention({
  SyntaxNodeType: InlineNsfl,
  startTokenMeaning: TokenMeaning.NsflStart,
  endTokenMeaning: TokenMeaning.NsflEnd
})
