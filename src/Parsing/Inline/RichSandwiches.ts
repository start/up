import { RichSandwich } from './RichSandwich'
import { TokenMeaning } from './Token'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'

const STRESS =
  new RichSandwich('**', '**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd)

const EMPHASIS =
  new RichSandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd)

const REVISION_DELETION =
  new RichSandwich('~~', '~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd)
  
const SPOILER =
  new RichSandwich('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd)

const INLINE_ASIDE =
  new RichSandwich('((', '))', InlineAsideNode, TokenMeaning.InlineAsideStart, TokenMeaning.InlineAsideEnd)
  
export {
  STRESS,
  EMPHASIS,
  REVISION_DELETION,
  SPOILER,
  INLINE_ASIDE,
}