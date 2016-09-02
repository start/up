import { MediaConvention } from './MediaConvention'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { TokenRole } from './TokenRole'


export const AUDIO: MediaConvention = {
  term: terms => terms.audio,
  SyntaxNodeType: Audio,
  startAndDescriptionTokenRole: TokenRole.AudioStartAndDescription
}

export const IMAGE: MediaConvention = {
  term: terms => terms.image,
  SyntaxNodeType: Image,
  startAndDescriptionTokenRole: TokenRole.ImageStartAndDescription
}

export const VIDEO: MediaConvention = {
  term: terms => terms.video,
  SyntaxNodeType: Video,
  startAndDescriptionTokenRole: TokenRole.VideoStartAndDescription
}
