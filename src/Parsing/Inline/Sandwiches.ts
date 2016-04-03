import { Sandwich } from './Sandwich'
import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TokenMeaning } from './Token'
import { Convention } from './Convention'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'

function sandwich(
  start: string,
  end: string,
  NodeType: RichInlineSyntaxNodeType,
  startMeaning: TokenMeaning,
  endMeaning: TokenMeaning
): Sandwich {
  return new Sandwich(start, end, NodeType, new Convention(startMeaning, endMeaning))
}

const EMPHASIS = sandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd)
const STRESS = sandwich('**', '**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd)
const REVISION_DELETION = sandwich('~~', '~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd)
const REVISION_INSERTION = sandwich('++', '++', RevisionInsertionNode, TokenMeaning.RevisionInserionStart, TokenMeaning.RevisionInsertionEnd)
const SPOILER = sandwich('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd)
const INLINE_ASIDE = sandwich('((', '))', InlineAsideNode, TokenMeaning.InlineAsideStart, TokenMeaning.InlineAsideEnd)

// These two sandwiches are created only inside of shouted text (text surrounded by with 3+ asterisks).
// Using different tokens allows us to more easily handle edge cases.
const SHOUTING_EMPHASIS = sandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd)
const SHOUTING_STRESS = sandwich('**', '**', StressNode, TokenMeaning.ShoutingStressStart, TokenMeaning.ShoutingStressEnd)

export {
  EMPHASIS,
  STRESS,
  REVISION_DELETION,
  REVISION_INSERTION,
  SPOILER,
  INLINE_ASIDE,
  SHOUTING_EMPHASIS,
  SHOUTING_STRESS
}