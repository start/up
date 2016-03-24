import { RichSandwich } from './RichSandwich'
import { TokenMeaning } from './Token'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'

const STRESS =
  new RichSandwich('**', '**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd)

const EMPHASIS =
  new RichSandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd)

const REVISION_DELETION =
  new RichSandwich('~~', '~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd)

const REVISION_INSERTION =
  new RichSandwich('++', '++', RevisionInsertionNode, TokenMeaning.RevisionInserionStart, TokenMeaning.RevisionInsertionEnd)
  
const SPOILER =
  new RichSandwich('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd)

const INLINE_ASIDE =
  new RichSandwich('((', '))', InlineAsideNode, TokenMeaning.InlineAsideStart, TokenMeaning.InlineAsideEnd)
  
export {
  STRESS,
  EMPHASIS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  INLINE_ASIDE
}