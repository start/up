import { MediaConvention } from './MediaConvention'
import { Audio } from '../../SyntaxNodes/Audio'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { TokenKind } from './Tokenization/TokenKind'


export const AUDIO_CONVENTION: MediaConvention = {
  labels: terms => terms.audio,
  NodeType: Audio,
  startAndDescriptionTokenKind: TokenKind.AudioStartAndDescription
}

export const IMAGE_CONVENTION: MediaConvention = {
  labels: terms => terms.image,
  NodeType: ImageNode,
  startAndDescriptionTokenKind: TokenKind.ImageStartAndDescription
}

export const VIDEO_CONVENTION: MediaConvention = {
  labels: terms => terms.video,
  NodeType: VideoNode,
  startAndDescriptionTokenKind: TokenKind.VideoStartAndDescription
}
