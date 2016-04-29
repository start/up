import { Convention } from './Convention'
import { TokenMeaning } from './Token'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'
import { MediaConvention } from './MediaConvention'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'

const AUDIO = new MediaConvention('audio', AudioNode, TokenMeaning.AudioStartAndAudioDescription, TokenMeaning.AudioUrlAndAudioEnd)
const IMAGE = new MediaConvention('image', ImageNode, TokenMeaning.ImageStartAndAudioDescription, TokenMeaning.ImageUrlAndAudioEnd)
const VIDEO = new MediaConvention('(?:video|video)', VideoNode, TokenMeaning.VideoStartAndAudioDescription, TokenMeaning.VideoUrlAndAudioEnd)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
