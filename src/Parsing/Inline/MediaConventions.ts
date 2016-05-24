import { MediaConvention } from './MediaConvention'
import { AudioToken } from './Tokens/AudioToken'
import { ImageToken } from './Tokens/ImageToken'
import { VideoToken } from './Tokens/VideoToken'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { TokenizerGoal } from './TokenizerGoal'

const AUDIO = new MediaConvention('audio', AudioNode, AudioToken, TokenizerGoal.Audio)
const IMAGE = new MediaConvention('image', ImageNode, ImageToken, TokenizerGoal.Image)
const VIDEO = new MediaConvention('video', VideoNode, VideoToken, TokenizerGoal.Video)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
