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
import { RichConventionWithoutSpecialAttributes } from './RichConventionWithoutSpecialAttributes'


export const EMPHASIS_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: EmphasisNode,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

export const STRESS_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: StressNode,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

export const REVISION_DELETION_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: RevisionDeletionNode,
  startTokenKind: TokenKind.RevisionDeletionStart,
  endTokenKind: TokenKind.RevisionDeletionEnd
}

export const REVISION_INSERTION_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: RevisionInsertionNode,
  startTokenKind: TokenKind.RevisionInsertionStart,
  endTokenKind: TokenKind.RevisionInsertionEnd
}

export const SPOILER_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: InlineSpoilerNode,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd
}

export const NSFW_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: InlineNsfwNode,
  startTokenKind: TokenKind.NsfwStart,
  endTokenKind: TokenKind.NsfwEnd
}

export const NSFL_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: InlineNsflNode,
  startTokenKind: TokenKind.NsflStart,
  endTokenKind: TokenKind.NsflEnd
}

export const FOOTNOTE_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: FootnoteNode,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd
}

export const PARENTHESIZED_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: ParenthesizedNode,
  startTokenKind: TokenKind.ParenthesizedStart,
  endTokenKind: TokenKind.ParenthesizedEnd
}

export const SQUARE_BRACKETED_CONVENTION: RichConventionWithoutSpecialAttributes = {
  NodeType: SquareBracketedNode,
  startTokenKind: TokenKind.SquareBracketedStart,
  endTokenKind: TokenKind.SquareBracketedEnd
}

export const ACTION_CONVENTION: RichConventionWithoutSpecialAttributes = {
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
