import { MediaConvention } from './MediaConvention'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { TokenKind } from './Tokenization/TokenKind'


export const AUDIO_CONVENTION: MediaConvention = {
  nonLocalizedTerm: 'audio',
  NodeType: AudioNode,
  descriptionAndStartTokenKind: TokenKind.AudioDescriptionAndStart
}

export const IMAGE_CONVENTION: MediaConvention = {
  nonLocalizedTerm: 'image',
  NodeType: ImageNode,
  descriptionAndStartTokenKind: TokenKind.ImageDescriptionAndStart
}

export const VIDEO_CONVENTION: MediaConvention = {
  nonLocalizedTerm: 'video',
  NodeType: VideoNode,
  descriptionAndStartTokenKind: TokenKind.VideoDescriptionAndStart
}
