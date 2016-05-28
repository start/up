import { RichConvention } from './RichConvention'
import { ParenthesizedStartToken } from './Tokens/ParenthesizedStartToken'
import { ParenthesizedEndToken } from './Tokens/ParenthesizedEndToken'
import { SquareBracketedStartToken } from './Tokens/SquareBracketedStartToken'
import { SquareBracketedEndToken } from './Tokens/SquareBracketedEndToken'
import { ActionStartToken } from './Tokens/ActionStartToken'
import { ActionEndToken } from './Tokens/ActionEndToken'
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
  StartTokenType: EmphasisStartToken,
  EndTokenType: EmphasisEndToken,
}

const STRESS: RichConvention = {
  StartTokenType: StressStartToken,
  EndTokenType: StressEndToken,
}

const REVISION_DELETION: RichConvention = {
  StartTokenType: RevisionDeletionStartToken,
  EndTokenType: RevisionDeletionEndToken,
  tokenizerGoal: TokenizerGoal.RevisionDeletion
}

const REVISION_INSERTION: RichConvention = {
  StartTokenType: RevisionInsertionStartToken,
  EndTokenType: RevisionInsertionEndToken,
  tokenizerGoal: TokenizerGoal.RevisionInsertion
}

const SPOILER: RichConvention = {
  StartTokenType: SpoilerStartToken,
  EndTokenType: SpoilerEndToken,
  tokenizerGoal: TokenizerGoal.Spoiler
}

const FOOTNOTE : RichConvention= {
  StartTokenType: FootnoteStartToken,
  EndTokenType: FootnoteEndToken,
  tokenizerGoal: TokenizerGoal.Footnote
}

const PARENTHESIZED: RichConvention =  {
  StartTokenType: ParenthesizedStartToken,
  EndTokenType: ParenthesizedEndToken,
  tokenizerGoal: TokenizerGoal.Parenthesized
}

const SQUARE_BRACKETED: RichConvention =  {
  StartTokenType: SquareBracketedStartToken,
  EndTokenType: SquareBracketedEndToken,
  tokenizerGoal: TokenizerGoal.SquareBracketed
}

const ACTION: RichConvention =  {
  StartTokenType: ActionStartToken,
  EndTokenType: ActionEndToken,
  tokenizerGoal: TokenizerGoal.Action
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
  ACTION
}
