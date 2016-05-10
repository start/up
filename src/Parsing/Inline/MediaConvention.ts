import { MediaTokenType } from './Tokens/MediaToken'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'
import { TokenizerState } from './TokenizerState'


export class MediaConvention {
  constructor(
    public nonLocalizedTerm: string,
    public NodeType: MediaSyntaxNodeType,
    public TokenType: MediaTokenType,
    public state: TokenizerState) { }
}
