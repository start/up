import { MediaConvention } from './MediaConvention'
import { TokenKind } from './TokenKind'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'

const AUDIO = new MediaConvention('audio', AudioNode, TokenKind.AudioDescriptionAndStart)
const IMAGE = new MediaConvention('image', ImageNode, TokenKind.ImageDescriptionAndStart)
const VIDEO = new MediaConvention('video', VideoNode, TokenKind.VideoDescriptionAndStart)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
