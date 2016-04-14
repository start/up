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

function media(
  facePattern: string,
  NodeType: MediaSyntaxNodeType,
  tokenMeaningForStartAndDescription: TokenMeaning,
  tokenMeaningForUrlAndEnd: TokenMeaning
): MediaConvention {
  return new MediaConvention(
    facePattern,
    NodeType,
    new Convention(tokenMeaningForStartAndDescription, tokenMeaningForUrlAndEnd)
  )
}

const AUDIO = media('-_-', AudioNode, TokenMeaning.AudioStartAndAudioDescription, TokenMeaning.AudioUrlAndAudioEnd)

export {
  AUDIO
}