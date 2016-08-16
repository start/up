import { TokenKind } from './Tokenization/TokenKind'
import { Config } from '../../Config'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  labels: (terms: Config.Terms) => Config.Terms.FoundInMarkup
  NodeType: MediaSyntaxNodeType
  startAndDescriptionTokenKind: TokenKind
}
