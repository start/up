import { NormalizedSettings } from '../../NormalizedSettings'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'
import { TokenRole } from './TokenRole'


export interface MediaConvention {
  keyword: (terms: NormalizedSettings.Parsing.Keywords) => NormalizedSettings.Parsing.Keyword
  SyntaxNodeType: MediaSyntaxNodeType
  tokenRoleForStartAndDescription: TokenRole
}
