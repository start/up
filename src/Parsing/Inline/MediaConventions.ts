import { MediaConvention } from './MediaConvention'
import { TokenKind } from './Tokenization/TokenKind'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


export const AUDIO_CONVENTION =
  new MediaConvention('audio', AudioNode, TokenKind.AudioDescriptionAndStart)

export const IMAGE_CONVENTION =
  new MediaConvention('image', ImageNode, TokenKind.ImageDescriptionAndStart)

export const VIDEO_CONVENTION =
  new MediaConvention('video', VideoNode, TokenKind.VideoDescriptionAndStart)
