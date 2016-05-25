import { MediaConvention } from './MediaConvention'
import { AudioStartToken } from './Tokens/AudioStartToken'
import { ImageStartToken } from './Tokens/ImageStartToken'
import { VideoStartToken } from './Tokens/VideoStartToken'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { TokenizerGoal } from './TokenizerGoal'

const AUDIO = new MediaConvention('audio', AudioNode, AudioStartToken, TokenizerGoal.Audio)
const IMAGE = new MediaConvention('image', ImageNode, ImageStartToken, TokenizerGoal.Image)
const VIDEO = new MediaConvention('video', VideoNode, VideoStartToken, TokenizerGoal.Video)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
