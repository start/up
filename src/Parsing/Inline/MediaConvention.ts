import { MediaTokenType } from './Tokens/MediaToken'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'

export class MediaConvention {
  constructor(
    public termForMediaType: string,
    public NodeType: MediaSyntaxNodeType,
    public TokenType: MediaTokenType) { }
}
