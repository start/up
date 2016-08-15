import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { ItalicNode } from '../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../SyntaxNodes/BoldNode'
import { HighlightNode } from '../../SyntaxNodes/HighlightNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SquareBracketParentheticalNode } from '../../SyntaxNodes/SquareBracketParentheticalNode'
import { NormalParentheticalNode } from '../../SyntaxNodes/NormalParentheticalNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { TokenKind } from './Tokenization/TokenKind'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'
import { RevealableConvention } from './RevealableConvention'


export const EMPHASIS_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: EmphasisNode,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

export const STRESS_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: StressNode,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

export const ITALIC_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: ItalicNode,
  startTokenKind: TokenKind.ItalicStart,
  endTokenKind: TokenKind.ItalicEnd
}

export const BOLD_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: BoldNode,
  startTokenKind: TokenKind.BoldStart,
  endTokenKind: TokenKind.BoldEnd
}

export const HIGHLIGHT_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: HighlightNode,
  startTokenKind: TokenKind.HighlightStart,
  endTokenKind: TokenKind.HighlightEnd
}

export const REVISION_DELETION_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: RevisionDeletionNode,
  startTokenKind: TokenKind.RevisionDeletionStart,
  endTokenKind: TokenKind.RevisionDeletionEnd
}

export const REVISION_INSERTION_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: RevisionInsertionNode,
  startTokenKind: TokenKind.RevisionInsertionStart,
  endTokenKind: TokenKind.RevisionInsertionEnd
}

export const FOOTNOTE_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: FootnoteNode,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd
}

export const PARENTHETICAL_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: NormalParentheticalNode,
  startTokenKind: TokenKind.ParentheticalStart,
  endTokenKind: TokenKind.ParentheticalEnd
}

export const SQUARE_BRACKET_PARENTHETICAL_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: SquareBracketParentheticalNode,
  startTokenKind: TokenKind.SquareBracketParentheticalStart,
  endTokenKind: TokenKind.SquareBracketParentheticalEnd
}

// The link convention has an extra field: its URL. Therefore, it doesn't satisfy the
// `RichConventionWithoutExtraFields` interface.
export const LINK_CONVENTION = {
  NodeType: LinkNode,
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkEndAndUrl
}

export const SPOILER_CONVENTION = new RevealableConvention({
  NodeType: InlineSpoilerNode,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd
})

export const NSFW_CONVENTION = new RevealableConvention({
  NodeType: InlineNsfwNode,
  startTokenKind: TokenKind.NsfwStart,
  endTokenKind: TokenKind.NsfwEnd
})

export const NSFL_CONVENTION = new RevealableConvention({
  NodeType: InlineNsflNode,
  startTokenKind: TokenKind.NsflStart,
  endTokenKind: TokenKind.NsflEnd
})
