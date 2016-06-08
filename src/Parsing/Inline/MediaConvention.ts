import { TokenKind } from './TokenKind'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export class MediaConvention {
  constructor(
    public nonLocalizedTerm: string,
    public NodeType: MediaSyntaxNodeType,
    public descriptionAndStartTokenKind: TokenKind) { }
}
