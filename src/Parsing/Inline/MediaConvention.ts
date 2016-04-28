import { TokenMeaning } from './Token'
import { applyBackslashEscaping } from '../TextHelpers'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'

export class MediaConvention {
  constructor(
    public facePattern: string,
    public NodeType: MediaSyntaxNodeType,
    public tokenMeaningForStartAndDescription: TokenMeaning,
    public tokenMeaningForUrlAndEnd: TokenMeaning) { }
}
