import { MediaConvention } from './MediaConvention'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { TokenKind } from './Tokenizing/TokenKind'


export const AUDIO: MediaConvention = {
  term: terms => terms.audio,
  NodeType: Audio,
  startAndDescriptionTokenKind: TokenKind.AudioStartAndDescription
}

export const IMAGE: MediaConvention = {
  term: terms => terms.image,
  NodeType: Image,
  startAndDescriptionTokenKind: TokenKind.ImageStartAndDescription
}

export const VIDEO: MediaConvention = {
  term: terms => terms.video,
  NodeType: Video,
  startAndDescriptionTokenKind: TokenKind.VideoStartAndDescription
}
