import { MediaConvention } from './MediaConvention'
import { AudioStartToken } from './Tokenizing/Tokens/AudioStartToken'
import { ImageStartToken } from './Tokenizing/Tokens/ImageStartToken'
import { VideoStartToken } from './Tokenizing/Tokens/VideoStartToken'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'

const AUDIO = new MediaConvention(AudioNode, AudioStartToken)
const IMAGE = new MediaConvention(ImageNode, ImageStartToken)
const VIDEO = new MediaConvention(VideoNode, VideoStartToken)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
