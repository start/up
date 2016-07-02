import { TokenKind } from './Tokenization/TokenKind'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


export const AUDIO_CONVENTION = {
  nonLocalizedTerm: 'audio',
  NodeType: AudioNode,
  descriptionAndStartTokenKind: TokenKind.AudioDescriptionAndStart
}

export const IMAGE_CONVENTION = {
  nonLocalizedTerm: 'image',
  NodeType: ImageNode,
  descriptionAndStartTokenKind: TokenKind.ImageDescriptionAndStart
}

export const VIDEO_CONVENTION = {
  nonLocalizedTerm: 'video',
  NodeType: VideoNode,
  descriptionAndStartTokenKind: TokenKind.VideoDescriptionAndStart
}
