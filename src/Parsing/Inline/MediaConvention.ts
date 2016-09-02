import { TokenMeaning } from './Tokenizing/TokenMeaning'
import { Config } from '../../Config'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  term: (terms: Config.Terms.Markup) => Config.Terms.FoundInMarkup
  SyntaxNodeType: MediaSyntaxNodeType
  startAndDescriptionTokenMeaning: TokenMeaning
}
