import { TokenRole } from './TokenRole'
import { Settings } from '../../Settings'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  term: (terms: Settings.Parsing.Terms) => Settings.Parsing.Term
  SyntaxNodeType: MediaSyntaxNodeType
  startAndDescriptionTokenRole: TokenRole
}
