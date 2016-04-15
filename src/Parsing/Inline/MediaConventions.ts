import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { TextConsumer } from '../TextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { applyBackslashEscaping } from '../TextHelpers'
import { applyRaisedVoices }  from './RaisedVoices/ApplyRaisedVoices'
import { getMediaTokenizer }  from './GetMediaTokenizer'
import { MediaSyntaxNodeType } from '../../SyntaxNodes/MediaSyntaxNode'
import { MediaConvention } from './MediaConvention'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'

const AUDIO = new MediaConvention('-_-', AudioNode, TokenMeaning.AudioStartAndAudioDescription, TokenMeaning.AudioUrlAndAudioEnd)
const IMAGE = new MediaConvention('o_o', ImageNode, TokenMeaning.ImageStartAndAudioDescription, TokenMeaning.ImageUrlAndAudioEnd)
const VIDEO = new MediaConvention('(?:-_o|o_-)', VideoNode, TokenMeaning.VideoStartAndAudioDescription, TokenMeaning.VideoUrlAndAudioEnd)

export {
  AUDIO,
  IMAGE,
  VIDEO
}
