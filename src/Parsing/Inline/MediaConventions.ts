import { MediaConvention } from './MediaConvention'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { TokenMeaning } from './TokenMeaning'


export const AUDIO: MediaConvention = {
  term: terms => terms.audio,
  SyntaxNodeType: Audio,
  startAndDescriptionTokenMeaning: TokenMeaning.AudioStartAndDescription
}

export const IMAGE: MediaConvention = {
  term: terms => terms.image,
  SyntaxNodeType: Image,
  startAndDescriptionTokenMeaning: TokenMeaning.ImageStartAndDescription
}

export const VIDEO: MediaConvention = {
  term: terms => terms.video,
  SyntaxNodeType: Video,
  startAndDescriptionTokenMeaning: TokenMeaning.VideoStartAndDescription
}
