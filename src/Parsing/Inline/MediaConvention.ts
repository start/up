import { TokenKind } from './Tokenization/TokenKind'
import { Config } from '../../Config'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  labels: (terms: Config.Terms.Markup) => Config.Terms.FoundInMarkup
  NodeType: MediaSyntaxNodeType
  startAndDescriptionTokenKind: TokenKind
}
