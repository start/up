import { MediaConvention } from './MediaConvention'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { TokenKind } from './Tokenization/TokenKind'


export const AUDIO_CONVENTION: MediaConvention = {
  term: terms => terms.audio,
  NodeType: AudioNode,
  startAndDescriptionTokenKind: TokenKind.AudioStartAndDescription
}

export const IMAGE_CONVENTION: MediaConvention = {
  term: terms => terms.image,
  NodeType: ImageNode,
  startAndDescriptionTokenKind: TokenKind.ImageStartAndDescription
}

export const VIDEO_CONVENTION: MediaConvention = {
  term: terms => terms.video,
  NodeType: VideoNode,
  startAndDescriptionTokenKind: TokenKind.VideoStartAndDescription
}
