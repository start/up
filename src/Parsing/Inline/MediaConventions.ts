import { MediaConvention } from './MediaConvention'
import { TokenKind } from './TokenKind'
import { TokenizerGoal } from './TokenizerGoal'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'

const AUDIO = new MediaConvention('audio', AudioNode, TokenKind.AudioStart, TokenizerGoal.Audio)
const IMAGE = new MediaConvention('image', ImageNode, TokenKind.ImageStart, TokenizerGoal.Image)
const VIDEO = new MediaConvention('video', VideoNode, TokenKind.VideoStart, TokenizerGoal.Video)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
