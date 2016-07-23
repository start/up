import { TokenKind } from './Tokenization/TokenKind'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  nonLocalizedTerm: string
  NodeType: MediaSyntaxNodeType
  startAndDescriptionTokenKind: TokenKind
}
