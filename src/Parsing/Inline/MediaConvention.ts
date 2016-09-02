import { TokenKind } from './Tokenizing/TokenKind'
import { Config } from '../../Config'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  term: (terms: Config.Terms.Markup) => Config.Terms.FoundInMarkup
  SyntaxNodeType: MediaSyntaxNodeType
  startAndDescriptionTokenKind: TokenKind
}
