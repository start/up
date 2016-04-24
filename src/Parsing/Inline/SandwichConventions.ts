import { SandwichConvention } from './SandwichConvention'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenMeaning } from './Token'
import { Convention } from './Convention'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteReferenceNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'

function sandwich(
  start: string,
  end: string,
  NodeType: RichInlineSyntaxNodeType,
  startMeaning: TokenMeaning,
  endMeaning: TokenMeaning
): SandwichConvention {
  return new SandwichConvention(start, end, NodeType, new Convention(startMeaning, endMeaning))
}

const STRESS = sandwich('**', '**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd)
const EMPHASIS = sandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd)
const REVISION_DELETION = sandwich('~~', '~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd)
const REVISION_INSERTION = sandwich('++', '++', RevisionInsertionNode, TokenMeaning.RevisionInserionStart, TokenMeaning.RevisionInsertionEnd)
const SPOILER = sandwich('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd)

// These are converted to footnote references later.
//
// TODO: Better handle leading space hack
const FOOTNOTE_REFERENCE = sandwich(' ((', '))', FootnoteNode, TokenMeaning.FootnoteReferenceStart, TokenMeaning.FootnoteReferenceEnd)


export {
  EMPHASIS,
  STRESS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  FOOTNOTE_REFERENCE
}
