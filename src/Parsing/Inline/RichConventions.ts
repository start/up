import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { TokenKind } from './Tokenization/TokenKind'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'
import { HiddenRichConvention } from './HiddenRichConvention'


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

export const SPOILER_CONVENTION = new HiddenRichConvention({
  NodeType: InlineSpoilerNode,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd,
})

export const NSFW_CONVENTION = new HiddenRichConvention({
  NodeType: InlineNsfwNode,
  startTokenKind: TokenKind.NsfwStart,
  endTokenKind: TokenKind.NsfwEnd,
})

export const NSFL_CONVENTION = new HiddenRichConvention({
  NodeType: InlineNsflNode,
  startTokenKind: TokenKind.NsflStart,
  endTokenKind: TokenKind.NsflEnd,
})

export const FOOTNOTE_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: FootnoteNode,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd
}

export const PARENTHESIZED_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: ParenthesizedNode,
  startTokenKind: TokenKind.ParenthesizedStart,
  endTokenKind: TokenKind.ParenthesizedEnd
}

export const SQUARE_BRACKETED_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: SquareBracketedNode,
  startTokenKind: TokenKind.SquareBracketedStart,
  endTokenKind: TokenKind.SquareBracketedEnd
}

export const ACTION_CONVENTION: RichConventionWithoutExtraFields = {
  NodeType: ActionNode,
  startTokenKind: TokenKind.ActionStart,
  endTokenKind: TokenKind.ActionEnd
}

// The link convention has a special attribute: its URL. Therefore, it doesn't satisfy the
// `RichConventionWithoutSpecialAttributes` interface.
export const LINK_CONVENTION = {
  NodeType: LinkNode,
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkUrlAndEnd
}
