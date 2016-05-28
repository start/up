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
import { ParenthesizedStartToken } from './Tokenizing/Tokens/ParenthesizedStartToken'
import { ParenthesizedEndToken } from './Tokenizing/Tokens/ParenthesizedEndToken'
import { SquareBracketedStartToken } from './Tokenizing/Tokens/SquareBracketedStartToken'
import { SquareBracketedEndToken } from './Tokenizing/Tokens/SquareBracketedEndToken'
import { ActionStartToken } from './Tokenizing/Tokens/ActionStartToken'
import { ActionEndToken } from './Tokenizing/Tokens/ActionEndToken'
import { StressEndToken } from './Tokenizing/Tokens/StressEndToken'
import { StressStartToken } from './Tokenizing/Tokens/StressStartToken'
import { SpoilerEndToken } from './Tokenizing/Tokens/SpoilerEndToken'
import { SpoilerStartToken } from './Tokenizing/Tokens/SpoilerStartToken'
import { EmphasisEndToken } from './Tokenizing/Tokens/EmphasisEndToken'
import { EmphasisStartToken } from './Tokenizing/Tokens/EmphasisStartToken'
import { FootnoteEndToken } from './Tokenizing/Tokens/FootnoteEndToken'
import { FootnoteStartToken } from './Tokenizing/Tokens/FootnoteStartToken'
import { RevisionInsertionStartToken } from './Tokenizing/Tokens/RevisionInsertionStartToken'
import { RevisionInsertionEndToken } from './Tokenizing/Tokens/RevisionInsertionEndToken'
import { RevisionDeletionStartToken } from './Tokenizing/Tokens/RevisionDeletionStartToken'
import { RevisionDeletionEndToken } from './Tokenizing/Tokens/RevisionDeletionEndToken'
import { LinkStartToken } from './Tokenizing/Tokens/LinkStartToken'
import { LinkEndToken } from './Tokenizing/Tokens/LinkEndToken'


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
  EndTokenType: RevisionDeletionEndToken
}

const REVISION_INSERTION: RichConvention = {
  NodeType: RevisionInsertionNode,
  StartTokenType: RevisionInsertionStartToken,
  EndTokenType: RevisionInsertionEndToken
}

const SPOILER: RichConvention = {
  NodeType: SpoilerNode,
  StartTokenType: SpoilerStartToken,
  EndTokenType: SpoilerEndToken
}

const FOOTNOTE : RichConvention= {
  NodeType: FootnoteNode,
  StartTokenType: FootnoteStartToken,
  EndTokenType: FootnoteEndToken
}

const PARENTHESIZED: RichConvention =  {
  NodeType: ParenthesizedNode,
  StartTokenType: ParenthesizedStartToken,
  EndTokenType: ParenthesizedEndToken
}

const SQUARE_BRACKETED: RichConvention =  {
  NodeType: SquareBracketedNode,
  StartTokenType: SquareBracketedStartToken,
  EndTokenType: SquareBracketedEndToken
}

const ACTION: RichConvention =  {
  NodeType: ActionNode,
  StartTokenType: ActionStartToken,
  EndTokenType: ActionEndToken
}

const LINK: RichConvention =  {
  StartTokenType: LinkStartToken,
  EndTokenType: LinkEndToken
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
