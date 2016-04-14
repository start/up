import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { Sandwich } from './Sandwich'
import { TextConsumer } from '../TextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { Token, TokenMeaning } from './Token'
import { FailureTracker } from './FailureTracker'
import { applyBackslashEscaping } from '../TextHelpers'
import { applyRaisedVoices }  from './RaisedVoices/ApplyRaisedVoices'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from './Sandwiches'

interface GetMediaTokenizerArgs {
  facePattern: string,
  tokenMeaningForStartAndDescription: TokenMeaning,
  tokenMeaningForUrlAndEnd: TokenMeaning
}

interface TokenizeMediaArgs {
  text: string,
  then: (lengthConsumed: number, tokens: Token[]) => void
}

export function getMediaTokenizer(getMediaTokenizerArgs: GetMediaTokenizerArgs) {
  const { tokenMeaningForStartAndDescription, tokenMeaningForUrlAndEnd } = getMediaTokenizerArgs
  const facePattern = new RegExp(getMediaTokenizerArgs.facePattern + ': ')

  return function tokenizeMedia(args: TokenizeMediaArgs): boolean {
    const consumer = new TextConsumer(args.text)

    const hasOpeningBracketAndFace =
      consumer.consumeIfMatches('[')
      && consumer.consumeIfMatchesPattern({ pattern: facePattern })

    if (!hasOpeningBracketAndFace) {
      return false
    }

    // We've found the opening bracket and the face. Now, let's get the media's description.
    let description: string

    // TODO: Check square bracket balance
    const didFindDescription = consumer.consume({
      upTo: ' -> ',
      then: match => description = applyBackslashEscaping(match)
    })

    if (!didFindDescription) {
      return false
    }

    // Finally, let's get the URL and go home.
    let url: string

    const didFindClosingBracket = consumer.consume({
      upTo: ' -> ',
      then: match => description = applyBackslashEscaping(match)
    })

    if (!didFindClosingBracket) {
      return false
    }
    
    const tokens = [
      new Token(tokenMeaningForStartAndDescription),
      new Token(tokenMeaningForUrlAndEnd)
    ]
    
    args.then(consumer.lengthConsumed(), tokens)

    return true
  }
}
