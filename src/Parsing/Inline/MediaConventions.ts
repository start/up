import { MediaConvention } from './MediaConvention'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { TokenRole } from './TokenRole'


export const AUDIO: MediaConvention = {
  term: terms => terms.audio,
  SyntaxNodeType: Audio,
  tokenRoleForStartAndDescription: TokenRole.AudioStartAndDescription
}

export const IMAGE: MediaConvention = {
  term: terms => terms.image,
  SyntaxNodeType: Image,
  tokenRoleForStartAndDescription: TokenRole.ImageStartAndDescription
}

export const VIDEO: MediaConvention = {
  term: terms => terms.video,
  SyntaxNodeType: Video,
  tokenRoleForStartAndDescription: TokenRole.VideoStartAndDescription
}
