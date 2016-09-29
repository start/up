import { MediaConvention } from './MediaConvention'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { TokenRole } from './TokenRole'


export const AUDIO: MediaConvention = {
  keyword: keywords => keywords.audio,
  SyntaxNodeType: Audio,
  tokenRoleForStartAndDescription: TokenRole.AudioStartAndDescription
}

export const IMAGE: MediaConvention = {
  keyword: keywords => keywords.image,
  SyntaxNodeType: Image,
  tokenRoleForStartAndDescription: TokenRole.ImageStartAndDescription
}

export const VIDEO: MediaConvention = {
  keyword: keywords => keywords.video,
  SyntaxNodeType: Video,
  tokenRoleForStartAndDescription: TokenRole.VideoStartAndDescription
}
