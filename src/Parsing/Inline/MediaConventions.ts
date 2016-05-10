import { MediaConvention } from './MediaConvention'
import { AudioToken } from './Tokens/AudioToken'
import { ImageToken } from './Tokens/ImageToken'
import { VideoToken } from './Tokens/VideoToken'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'

const AUDIO = new MediaConvention('audio', AudioNode, AudioToken)
const IMAGE = new MediaConvention('image', ImageNode, ImageToken)
const VIDEO = new MediaConvention('video', VideoNode, VideoToken)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
