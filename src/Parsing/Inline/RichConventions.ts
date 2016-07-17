import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { NsfwNode } from '../../SyntaxNodes/NsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { TokenKind } from './Tokenization/TokenKind'


export const EMPHASIS_CONVENTION = {
  NodeType: EmphasisNode,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

export const STRESS_CONVENTION = {
  NodeType: StressNode,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

export const REVISION_DELETION_CONVENTION = {
  NodeType: RevisionDeletionNode,
  startTokenKind: TokenKind.RevisionDeletionStart,
  endTokenKind: TokenKind.RevisionDeletionEnd
}

export const REVISION_INSERTION_CONVENTION = {
  NodeType: RevisionInsertionNode,
  startTokenKind: TokenKind.RevisionInsertionStart,
  endTokenKind: TokenKind.RevisionInsertionEnd
}

export const SPOILER_CONVENTION = {
  NodeType: InlineSpoilerNode,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd
}

export const NSFW_CONVENTION = {
  NodeType: NsfwNode,
  startTokenKind: TokenKind.NsfwStart,
  endTokenKind: TokenKind.NsfwEnd
}

export const NSFL_CONVENTION = {
  NodeType: InlineNsflNode,
  startTokenKind: TokenKind.NsflStart,
  endTokenKind: TokenKind.NsflEnd
}

export const FOOTNOTE_CONVENTION = {
  NodeType: FootnoteNode,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd
}

export const PARENTHESIZED_CONVENTION =  {
  NodeType: ParenthesizedNode,
  startTokenKind: TokenKind.ParenthesizedStart,
  endTokenKind: TokenKind.ParenthesizedEnd
}

export const SQUARE_BRACKETED_CONVENTION =  {
  NodeType: SquareBracketedNode,
  startTokenKind: TokenKind.SquareBracketedStart,
  endTokenKind: TokenKind.SquareBracketedEnd
}

export const ACTION_CONVENTION =  {
  NodeType: ActionNode,
  startTokenKind: TokenKind.ActionStart,
  endTokenKind: TokenKind.ActionEnd
}

export const LINK_CONVENTION =  {
  NodeType: LinkNode,
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkUrlAndEnd
}
