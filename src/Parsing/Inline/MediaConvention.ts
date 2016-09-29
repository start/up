import { TokenRole } from './TokenRole'
import { Settings } from '../../Settings'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  keyword: (terms: Settings.Parsing.Keywords) => Settings.Parsing.Keyword
  SyntaxNodeType: MediaSyntaxNodeType
  tokenRoleForStartAndDescription: TokenRole
}
