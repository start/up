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

const SANDWICHES = [
  sandwich('**', '**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd),
  sandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd),
  sandwich('~~', '~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd),
  sandwich('++', '++', RevisionInsertionNode, TokenMeaning.RevisionInserionStart, TokenMeaning.RevisionInsertionEnd),
  sandwich('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd),
  sandwich('((', '))', InlineAsideNode, TokenMeaning.InlineAsideStart, TokenMeaning.InlineAsideEnd)
]
  
export {
  SANDWICHES
}