import { Sandwich } from './Sandwich'
import { TokenMeaning } from './Token'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'

const STRESS =
  new Sandwich('**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd)

const EMPHASIS =
  new Sandwich('*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd)

const REVISION_DELETION =
  new Sandwich('~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd)
  
export {
  STRESS,
  EMPHASIS,
  REVISION_DELETION
}