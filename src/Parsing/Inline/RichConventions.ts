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


const EMPHASIS: RichConvention = {
  NodeType: EmphasisNode,
  startTokenKind: TokenKind.EmphasisStart,
  endTokenKind: TokenKind.EmphasisEnd
}

const STRESS: RichConvention = {
  NodeType: StressNode,
  startTokenKind: TokenKind.StressStart,
  endTokenKind: TokenKind.StressEnd
}

const REVISION_DELETION: RichConvention = {
  NodeType: RevisionDeletionNode,
  startTokenKind: TokenKind.RevisionDeletionStart,
  endTokenKind: TokenKind.RevisionDeletionEnd,
  tokenizerGoal: TokenizerGoal.RevisionDeletion
}

const REVISION_INSERTION: RichConvention = {
  NodeType: RevisionInsertionNode,
  startTokenKind: TokenKind.RevisionInsertionStart,
  endTokenKind: TokenKind.RevisionInsertionEnd,
  tokenizerGoal: TokenizerGoal.RevisionInsertion
}

const SPOILER: RichConvention = {
  NodeType: SpoilerNode,
  startTokenKind: TokenKind.SpoilerStart,
  endTokenKind: TokenKind.SpoilerEnd,
  tokenizerGoal: TokenizerGoal.Spoiler
}

const FOOTNOTE : RichConvention= {
  NodeType: FootnoteNode,
  startTokenKind: TokenKind.FootnoteStart,
  endTokenKind: TokenKind.FootnoteEnd,
  tokenizerGoal: TokenizerGoal.Footnote
}

const PARENTHESIZED: RichConvention =  {
  NodeType: ParenthesizedNode,
  startTokenKind: TokenKind.ParenthesizedStart,
  endTokenKind: TokenKind.ParenthesizedEnd,
  tokenizerGoal: TokenizerGoal.Parenthesized
}

const SQUARE_BRACKETED: RichConvention =  {
  NodeType: SquareBracketedNode,
  startTokenKind: TokenKind.SquareBracketedStart,
  endTokenKind: TokenKind.SquareBracketedEnd,
  tokenizerGoal: TokenizerGoal.SquareBracketed
}

const ACTION: RichConvention =  {
  NodeType: ActionNode,
  startTokenKind: TokenKind.ActionStart,
  endTokenKind: TokenKind.ActionEnd,
  tokenizerGoal: TokenizerGoal.Action
}

const LINK: RichConvention =  {
  startTokenKind: TokenKind.LinkStart,
  endTokenKind: TokenKind.LinkUrlAndEnd,
  tokenizerGoal: TokenizerGoal.Link
}

export {
  EMPHASIS,
  STRESS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE,
  LINK,
  PARENTHESIZED,
  SQUARE_BRACKETED,
  ACTION
}
