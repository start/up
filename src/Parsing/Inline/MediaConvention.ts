import { TokenType } from './Tokenizing/TokenType'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export class MediaConvention {
  constructor(
    public NodeType: MediaSyntaxNodeType,
    public StartTokenType: TokenType) { }
}
