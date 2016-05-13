import { RichConvention } from './RichConvention'
import { TokenType } from './Tokens/Token'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
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
import { TokenizerState } from './TokenizerState'


const EMPHASIS = {
  NodeType: EmphasisNode,
  StartTokenType: EmphasisStartToken,
  EndTokenType: EmphasisEndToken,
}

const STRESS = {
  NodeType: StressNode,
  StartTokenType: StressStartToken,
  EndTokenType: StressEndToken,
}

const REVISION_DELETION = {
  NodeType: RevisionDeletionNode,
  StartTokenType: RevisionDeletionStartToken,
  EndTokenType: RevisionDeletionEndToken,
  tokenizerState: TokenizerState.RevisionDeletion
}

const REVISION_INSERTION = {
  NodeType: RevisionInsertionNode,
  StartTokenType: RevisionInsertionStartToken,
  EndTokenType: RevisionInsertionEndToken,
  tokenizerState: TokenizerState.RevisionInsertion
}

const SPOILER = {
  NodeType: SpoilerNode,
  StartTokenType: SpoilerStartToken,
  EndTokenType: SpoilerEndToken,
  tokenizerState: TokenizerState.Spoiler
}

const FOOTNOTE = {
  NodeType: FootnoteNode,
  StartTokenType: FootnoteStartToken,
  EndTokenType: FootnoteEndToken,
  tokenizerState: TokenizerState.Footnote
}

const LINK =  {
  StartTokenType: LinkStartToken,
  EndTokenType: LinkEndToken,
  tokenizerState: TokenizerState.Link
}

export {
  EMPHASIS,
  STRESS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE,
  LINK
}
