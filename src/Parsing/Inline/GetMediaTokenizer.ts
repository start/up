import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { TextConsumer } from './TextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { Token } from './Tokens/Token'
import { applyBackslashEscaping } from '../TextHelpers'
import { MediaConvention } from './MediaConvention'

interface TokenizeMediaArgs {
  text: string,
  then: (lengthConsumed: number, tokens: Token[]) => void
}

export function getMediaTokenizer(mediaConvention: MediaConvention) {
  const { TokenType } = mediaConvention
  
  // Media conventions start with an opening bracket, the term for the type of media, and a colon.
  //
  // For example:
  //
  // [audio: ...
  const mediaStartPattern = new RegExp(`^\\[${mediaConvention.termForMediaType}:`)

  return function tokenizeMedia(args: TokenizeMediaArgs): boolean {
    const consumer = new TextConsumer(args.text)

    const doesSatisfyStartPattern = consumer.consumeIfMatchesPattern({ pattern: mediaStartPattern })

    if (!doesSatisfyStartPattern) {
      return false
    }

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
    
    args.then(consumer.lengthConsumed(), [new TokenType(description, url)])

    return true
  }
}
