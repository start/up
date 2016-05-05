import { RichConvention } from './RichConvention'
import { TokenType } from './Tokens/Token'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
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


const STRESS = new RichConvention(StressNode, StressStartToken, StressEndToken)
const EMPHASIS = new RichConvention(EmphasisNode, EmphasisStartToken, EmphasisEndToken)
const REVISION_DELETION = new RichConvention(RevisionDeletionNode, RevisionDeletionStartToken, RevisionDeletionEndToken)
const REVISION_INSERTION = new RichConvention(RevisionInsertionNode, RevisionInsertionStartToken, RevisionInsertionEndToken)
const SPOILER = new RichConvention(SpoilerNode, SpoilerStartToken, SpoilerEndToken)
const FOOTNOTE = new RichConvention(FootnoteNode, FootnoteStartToken, FootnoteEndToken)


export {
  EMPHASIS,
  STRESS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE
}
