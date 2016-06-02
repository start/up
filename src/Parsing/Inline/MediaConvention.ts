import { TokenKind } from './TokenKind'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'
import { TokenizerGoal } from './TokenizerGoal'


export class MediaConvention {
  constructor(
    public nonLocalizedTerm: string,
    public NodeType: MediaSyntaxNodeType,
    public StartTokenType: TokenKind,
    public goal: TokenizerGoal) { }
}
