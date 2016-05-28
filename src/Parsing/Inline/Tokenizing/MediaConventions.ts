import { MediaConvention } from './MediaConvention'
import { AudioStartToken } from './Tokens/AudioStartToken'
import { ImageStartToken } from './Tokens/ImageStartToken'
import { VideoStartToken } from './Tokens/VideoStartToken'
import { TokenizerGoal } from './TokenizerGoal'

const AUDIO = new MediaConvention('audio', AudioStartToken, TokenizerGoal.Audio)
const IMAGE = new MediaConvention('image', ImageStartToken, TokenizerGoal.Image)
const VIDEO = new MediaConvention('video', VideoStartToken, TokenizerGoal.Video)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
