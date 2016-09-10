import { TokenRole } from './TokenRole'
import { Config } from '../../Config'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  term: (terms: Config.Parsing.Terms) => Config.Parsing.Term
  SyntaxNodeType: MediaSyntaxNodeType
  startAndDescriptionTokenRole: TokenRole
}
