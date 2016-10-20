import { TokenRole } from './TokenRole'
import { NormalizedSettings } from '../../NormalizedSettings'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'


export interface MediaConvention {
  keyword: (terms: NormalizedSettings.Parsing.Keywords) => NormalizedSettings.Parsing.Keyword
  SyntaxNodeType: MediaSyntaxNodeType
  tokenRoleForStartAndDescription: TokenRole
}
