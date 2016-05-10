import { MediaTokenType } from './Tokens/MediaToken'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'

export class MediaConvention {
  constructor(
    public nonLocalizedTerm: string,
    public NodeType: MediaSyntaxNodeType,
    public TokenType: MediaTokenType) { }
}
