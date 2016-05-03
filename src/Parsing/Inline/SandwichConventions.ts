import { SandwichConvention } from './SandwichConvention'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenType } from './Tokens/Token'
import { Convention } from './Convention'
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


const STRESS = new SandwichConvention('**', '**', StressNode, StressStartToken, StressEndToken)
const EMPHASIS = new SandwichConvention('*', '*', EmphasisNode, EmphasisStartToken, EmphasisEndToken)
const REVISION_DELETION = new SandwichConvention('~~', '~~', RevisionDeletionNode, RevisionDeletionStartToken, RevisionInsertionEndToken)
const REVISION_INSERTION = new SandwichConvention('++', '++', RevisionInsertionNode, RevisionInsertionStartToken, RevisionInsertionEndToken)
const SPOILER = new SandwichConvention('[SPOILER: ', ']', SpoilerNode, SpoilerStartToken, SpoilerEndToken)

// TODO: Better handle leading space hack
const FOOTNOTE = new SandwichConvention(' ((', '))', FootnoteNode, FootnoteStartToken, FootnoteEndToken)


export {
  EMPHASIS,
  STRESS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE
}
