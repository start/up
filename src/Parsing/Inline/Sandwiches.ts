import { Sandwich } from './Sandwich'
import { TokenMeaning } from './Token'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'

const STRESS =
  new Sandwich('**', '**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd)

const EMPHASIS =
  new Sandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd)

const REVISION_DELETION =
  new Sandwich('~~', '~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd)
  
const SPOILER =
  new Sandwich('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd)

const INLINE_ASIDE =
  new Sandwich('((', '))', InlineAsideNode, TokenMeaning.InlineAsideStart, TokenMeaning.InlineAsideEnd)
  
export {
  STRESS,
  EMPHASIS,
  REVISION_DELETION,
  SPOILER,
  INLINE_ASIDE,
}