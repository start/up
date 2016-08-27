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
import { RevisionDeletion } from '../../SyntaxNodes/RevisionDeletion'
import { RevisionInsertion } from '../../SyntaxNodes/RevisionInsertion'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { Link } from '../../SyntaxNodes/Link'
import { TokenKind } from './Tokenization/TokenKind'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'
import { RevealableConvention } from './RevealableConvention'


export const EMPHASIS_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: Emphasis,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

export const STRESS_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: Stress,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

export const ITALIC_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: Italic,
  startTokenKind: TokenKind.ItalicStart,
  endTokenKind: TokenKind.ItalicEnd
}

export const BOLD_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: Bold,
  startTokenKind: TokenKind.BoldStart,
  endTokenKind: TokenKind.BoldEnd
}

export const HIGHLIGHT_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: Highlight,
  startTokenKind: TokenKind.HighlightStart,
  endTokenKind: TokenKind.HighlightEnd
}

export const REVISION_DELETION_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: RevisionDeletion,
  startTokenKind: TokenKind.RevisionDeletionStart,
  endTokenKind: TokenKind.RevisionDeletionEnd
}

export const REVISION_INSERTION_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: RevisionInsertion,
  startTokenKind: TokenKind.RevisionInsertionStart,
  endTokenKind: TokenKind.RevisionInsertionEnd
}

export const QUOTE_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: InlineQuote,
  startTokenKind: TokenKind.QuoteStart,
  endTokenKind: TokenKind.QuoteEnd
}

export const FOOTNOTE_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: Footnote,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd
}

export const NORMAL_PARENTHETICAL_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: NormalParenthetical,
  startTokenKind: TokenKind.NormalParentheticalStart,
  endTokenKind: TokenKind.NormalParentheticalEnd
}

export const SQUARE_PARENTHETICAL_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: SquareParenthetical,
  startTokenKind: TokenKind.SquareParentheticalStart,
  endTokenKind: TokenKind.SquareParentheticalEnd
}

// The link convention has an extra field: its URL. Therefore, it doesn't satisfy the
// `RichConventionWithoutExtraFields` interface.
export const LINK_CONVENTION = {
  NodeType: Link,
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkEndAndUrl
}

export const SPOILER_CONVENTION = new RevealableConvention({
  NodeType: InlineSpoiler,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd
})

export const NSFW_CONVENTION = new RevealableConvention({
  NodeType: InlineNsfw,
  startTokenKind: TokenKind.NsfwStart,
  endTokenKind: TokenKind.NsfwEnd
})

export const NSFL_CONVENTION = new RevealableConvention({
  NodeType: InlineNsfl,
  startTokenKind: TokenKind.NsflStart,
  endTokenKind: TokenKind.NsflEnd
})
