import { MediaConvention } from './MediaConvention'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { TokenKind } from './Tokenization/TokenKind'


export const AUDIO_CONVENTION: MediaConvention = {
  term: terms => terms.audio,
  NodeType: Audio,
  startAndDescriptionTokenKind: TokenKind.AudioStartAndDescription
}

export const IMAGE_CONVENTION: MediaConvention = {
  term: terms => terms.image,
  NodeType: Image,
  startAndDescriptionTokenKind: TokenKind.ImageStartAndDescription
}

export const VIDEO_CONVENTION: MediaConvention = {
  term: terms => terms.video,
  NodeType: Video,
  startAndDescriptionTokenKind: TokenKind.VideoStartAndDescription
}
