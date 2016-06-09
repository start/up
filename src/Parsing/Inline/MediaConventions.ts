import { MediaConvention } from './MediaConvention'
import { TokenKind } from './TokenKind'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


export const AUDIO =
  new MediaConvention('audio', AudioNode, TokenKind.AudioDescriptionAndStart)

export const IMAGE =
  new MediaConvention('image', ImageNode, TokenKind.ImageDescriptionAndStart)

export const VIDEO =
  new MediaConvention('video', VideoNode, TokenKind.VideoDescriptionAndStart)
