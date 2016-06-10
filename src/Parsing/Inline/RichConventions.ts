import { RichConvention } from './RichConvention'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../SyntaxNodes/NsflNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { TokenKind } from './TokenKind'


export const EMPHASIS_CONVENTION: RichConvention = {
  NodeType: EmphasisNode,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

export const STRESS_CONVENTION: RichConvention = {
  NodeType: StressNode,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

export const REVISION_DELETION_CONVENTION: RichConvention = {
  NodeType: RevisionDeletionNode,
  startTokenKind: TokenKind.RevisionDeletionStart,
  endTokenKind: TokenKind.RevisionDeletionEnd
}

export const REVISION_INSERTION_CONVENTION: RichConvention = {
  NodeType: RevisionInsertionNode,
  startTokenKind: TokenKind.RevisionInsertionStart,
  endTokenKind: TokenKind.RevisionInsertionEnd
}

export const SPOILER_CONVENTION: RichConvention = {
  NodeType: SpoilerNode,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd
}

export const NSFW_CONVENTION: RichConvention = {
  NodeType: NsfwNode,
  startTokenKind: TokenKind.NsfwStart,
  endTokenKind: TokenKind.NsfwEnd
}

export const NSFL_CONVENTION: RichConvention = {
  NodeType: NsflNode,
  startTokenKind: TokenKind.NsflStart,
  endTokenKind: TokenKind.NsflEnd
}

export const FOOTNOTE_CONVENTION : RichConvention= {
  NodeType: FootnoteNode,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd
}

export const PARENTHESIZED_CONVENTION: RichConvention =  {
  NodeType: ParenthesizedNode,
  startTokenKind: TokenKind.ParenthesizedStart,
  endTokenKind: TokenKind.ParenthesizedEnd
}

export const SQUARE_BRACKETED_CONVENTION: RichConvention =  {
  NodeType: SquareBracketedNode,
  startTokenKind: TokenKind.SquareBracketedStart,
  endTokenKind: TokenKind.SquareBracketedEnd
}

export const ACTION_CONVENTION: RichConvention =  {
  NodeType: ActionNode,
  startTokenKind: TokenKind.ActionStart,
  endTokenKind: TokenKind.ActionEnd
}

export const LINK_CONVENTION: RichConvention =  {
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkUrlAndEnd
}
