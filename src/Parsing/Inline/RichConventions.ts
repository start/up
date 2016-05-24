import { RichConvention } from './RichConvention'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { CurlyBracketedNode } from '../../SyntaxNodes/CurlyBracketedNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParenthesizedStartToken } from './Tokens/ParenthesizedStartToken'
import { ParenthesizedEndToken } from './Tokens/ParenthesizedEndToken'
import { SquareBracketedStartToken } from './Tokens/SquareBracketedStartToken'
import { SquareBracketedEndToken } from './Tokens/SquareBracketedEndToken'
import { CurlyBracketedStartToken } from './Tokens/CurlyBracketedStartToken'
import { CurlyBracketedEndToken } from './Tokens/CurlyBracketedEndToken'
import { StressEndToken } from './Tokens/StressEndToken'
import { StressStartToken } from './Tokens/StressStartToken'
import { SpoilerEndToken } from './Tokens/SpoilerEndToken'
import { SpoilerStartToken } from './Tokens/SpoilerStartToken'
import { EmphasisEndToken } from './Tokens/EmphasisEndToken'
import { EmphasisStartToken } from './Tokens/EmphasisStartToken'
import { FootnoteEndToken } from './Tokens/FootnoteEndToken'
import { FootnoteStartToken } from './Tokens/FootnoteStartToken'
import { RevisionInsertionStartToken } from './Tokens/RevisionInsertionStartToken'
import { RevisionInsertionEndToken } from './Tokens/RevisionInsertionEndToken'
import { RevisionDeletionStartToken } from './Tokens/RevisionDeletionStartToken'
import { RevisionDeletionEndToken } from './Tokens/RevisionDeletionEndToken'
import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { TokenizerGoal } from './TokenizerGoal'


const EMPHASIS: RichConvention = {
  NodeType: EmphasisNode,
  StartTokenType: EmphasisStartToken,
  EndTokenType: EmphasisEndToken,
}

const STRESS: RichConvention = {
  NodeType: StressNode,
  StartTokenType: StressStartToken,
  EndTokenType: StressEndToken,
}

const REVISION_DELETION: RichConvention = {
  NodeType: RevisionDeletionNode,
  StartTokenType: RevisionDeletionStartToken,
  EndTokenType: RevisionDeletionEndToken,
  tokenizerGoal: TokenizerGoal.RevisionDeletion
}

const REVISION_INSERTION: RichConvention = {
  NodeType: RevisionInsertionNode,
  StartTokenType: RevisionInsertionStartToken,
  EndTokenType: RevisionInsertionEndToken,
  tokenizerGoal: TokenizerGoal.RevisionInsertion
}

const SPOILER: RichConvention = {
  NodeType: SpoilerNode,
  StartTokenType: SpoilerStartToken,
  EndTokenType: SpoilerEndToken,
  tokenizerGoal: TokenizerGoal.Spoiler
}

const FOOTNOTE : RichConvention= {
  NodeType: FootnoteNode,
  StartTokenType: FootnoteStartToken,
  EndTokenType: FootnoteEndToken,
  tokenizerGoal: TokenizerGoal.Footnote
}

const PARENTHESIZED: RichConvention =  {
  NodeType: ParenthesizedNode,
  StartTokenType: ParenthesizedStartToken,
  EndTokenType: ParenthesizedEndToken,
  tokenizerGoal: TokenizerGoal.Parenthesized
}

const SQUARE_BRACKETED: RichConvention =  {
  NodeType: SquareBracketedNode,
  StartTokenType: SquareBracketedStartToken,
  EndTokenType: SquareBracketedEndToken,
  tokenizerGoal: TokenizerGoal.SquareBracketed
}

const CURLY_BRACKETED: RichConvention =  {
  NodeType: CurlyBracketedNode,
  StartTokenType: CurlyBracketedStartToken,
  EndTokenType: CurlyBracketedEndToken,
  tokenizerGoal: TokenizerGoal.CurlyBracketed
}

const LINK: RichConvention =  {
  StartTokenType: LinkStartToken,
  EndTokenType: LinkEndToken,
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
  CURLY_BRACKETED
}
