import { MediaConvention } from './MediaConvention'
import { AudioToken } from './Tokens/AudioToken'
import { ImageToken } from './Tokens/ImageToken'
import { VideoToken } from './Tokens/VideoToken'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { TokenizerState } from './TokenizerState'

const AUDIO = new MediaConvention('audio', AudioNode, AudioToken, TokenizerState.Audio)
const IMAGE = new MediaConvention('image', ImageNode, ImageToken, TokenizerState.Image)
const VIDEO = new MediaConvention('video', VideoNode, VideoToken, TokenizerState.Video)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
