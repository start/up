import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { TextConsumer } from '../TextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { applyRaisedVoices }  from './RaisedVoices/ApplyRaisedVoices'
import { MediaConvention } from './MediaConvention'
import { AUDIO } from './MediaConventions'

interface TokenizeMediaArgs {
  text: string,
  then: (lengthConsumed: number, tokens: Token[]) => void
}

export function getMediaTokenizer(mediaConvention: MediaConvention) {
  const { tokenMeaningForStartAndDescription, tokenMeaningForUrlAndEnd } = mediaConvention
  
  
  // Media conventions start with an opening bracket, a face, and a colon:
  //
  // [-_-: ...
  const mediaStartPattern = new RegExp(`^\\[${mediaConvention.facePattern}: `)

  return function tokenizeMedia(args: TokenizeMediaArgs): boolean {
    const consumer = new TextConsumer(args.text)

    const doesSatisfyStartPattern = consumer.consumeIfMatchesPattern({ pattern: mediaStartPattern })

    if (!doesSatisfyStartPattern) {
      return false
    }

    // We've made it this far, so it's likely that we're dealing with a media convention.
    //
    // Let's determine the media's description.
    let description: string

    // TODO: Check square bracket balance
    const didFindUrlArrow = consumer.consume({
      upTo: ' -> ',
      then: match => description = applyBackslashEscaping(match)
    })

    if (!didFindUrlArrow) {
      return false
    }

    // Finally, let's get the URL and go home.
    let url: string

    const didFindClosingBracket = consumer.consume({
      upTo: ']',
      then: match => url = applyBackslashEscaping(match)
    })

    if (!didFindClosingBracket) {
      return false
    }
    
    const tokens = [
      new Token(tokenMeaningForStartAndDescription, description),
      new Token(tokenMeaningForUrlAndEnd, url)
    ]
    
    args.then(consumer.lengthConsumed(), tokens)

    return true
  }
}
