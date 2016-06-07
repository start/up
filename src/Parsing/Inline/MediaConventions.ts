import { MediaConvention } from './MediaConvention'
import { TokenKind } from './TokenKind'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'

const AUDIO = new MediaConvention('audio', AudioNode, TokenKind.AudioStart)
const IMAGE = new MediaConvention('image', ImageNode, TokenKind.ImageStart)
const VIDEO = new MediaConvention('video', VideoNode, TokenKind.VideoStart)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
