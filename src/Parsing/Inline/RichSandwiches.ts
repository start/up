import { RichSandwich } from './RichSandwich'
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
): RichSandwich {
  return new RichSandwich(start, end, NodeType, new Convention(NodeType, startMeaning, endMeaning))
}

const RICH_SANDWICHES = [
  sandwich('**', '**', StressNode, TokenMeaning.StressStart, TokenMeaning.StressEnd),
  sandwich('*', '*', EmphasisNode, TokenMeaning.EmphasisStart, TokenMeaning.EmphasisEnd),
  sandwich('~~', '~~', RevisionDeletionNode, TokenMeaning.RevisionDeletionStart, TokenMeaning.RevisionDeletionEnd),
  sandwich('++', '++', RevisionInsertionNode, TokenMeaning.RevisionInserionStart, TokenMeaning.RevisionInsertionEnd),
  sandwich('[<_<]', '[>_>]', SpoilerNode, TokenMeaning.SpoilerStart, TokenMeaning.SpoilerEnd),
  sandwich('((', '))', InlineAsideNode, TokenMeaning.InlineAsideStart, TokenMeaning.InlineAsideEnd)
]
  
export {
  RICH_SANDWICHES
}