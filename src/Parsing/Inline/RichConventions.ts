import { RichConvention } from './RichConvention'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { TokenizerGoal } from './TokenizerGoal'
import { TokenKind } from './TokenKind'


const EMPHASIS_CONVENTION: RichConvention = {
  NodeType: EmphasisNode,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

const STRESS_CONVENTION: RichConvention = {
  NodeType: StressNode,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

const REVISION_DELETION_CONVENTION: RichConvention = {
  NodeType: RevisionDeletionNode,
  startTokenKind: TokenKind.RevisionDeletionStart,
  endTokenKind: TokenKind.RevisionDeletionEnd,
  tokenizerGoal: TokenizerGoal.RevisionDeletion
}

const REVISION_INSERTION_CONVENTION: RichConvention = {
  NodeType: RevisionInsertionNode,
  startTokenKind: TokenKind.RevisionInsertionStart,
  endTokenKind: TokenKind.RevisionInsertionEnd,
  tokenizerGoal: TokenizerGoal.RevisionInsertion
}

const SPOILER_CONVENTION: RichConvention = {
  NodeType: SpoilerNode,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd,
  tokenizerGoal: TokenizerGoal.Spoiler
}

const FOOTNOTE_CONVENTION : RichConvention= {
  NodeType: FootnoteNode,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd,
  tokenizerGoal: TokenizerGoal.Footnote
}

const PARENTHESIZED_CONVENTION: RichConvention =  {
  NodeType: ParenthesizedNode,
  startTokenKind: TokenKind.ParenthesizedStart,
  endTokenKind: TokenKind.ParenthesizedEnd,
  tokenizerGoal: TokenizerGoal.Parenthesized
}

const SQUARE_BRACKETED_CONVENTION: RichConvention =  {
  NodeType: SquareBracketedNode,
  startTokenKind: TokenKind.SquareBracketedStart,
  endTokenKind: TokenKind.SquareBracketedEnd,
  tokenizerGoal: TokenizerGoal.SquareBracketed
}

const ACTION_CONVENTION: RichConvention =  {
  NodeType: ActionNode,
  startTokenKind: TokenKind.ActionStart,
  endTokenKind: TokenKind.ActionEnd,
  tokenizerGoal: TokenizerGoal.Action
}

const LINK_CONVENTION: RichConvention =  {
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkUrlAndEnd,
  tokenizerGoal: TokenizerGoal.Link
}

export {
  EMPHASIS_CONVENTION,
  STRESS_CONVENTION,
  REVISION_DELETION_CONVENTION,
  REVISION_INSERTION_CONVENTION,
  SPOILER_CONVENTION,
  FOOTNOTE_CONVENTION,
  LINK_CONVENTION,
  PARENTHESIZED_CONVENTION,
  SQUARE_BRACKETED_CONVENTION,
  ACTION_CONVENTION
}
