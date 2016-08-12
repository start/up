import { TokenKind } from './Tokenization/TokenKind'
import { Config } from '../../Config'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  term: (terms: Config.Terms) => string
  NodeType: MediaSyntaxNodeType
  startAndDescriptionTokenKind: TokenKind
}
