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

interface Args {
  facePattern: string,
  mediaStartAndMediaDescription: TokenMeaning,
  mediaEndAndMediaUrl: TokenMeaning,
}

export function getMediaTokenizer(args: Args) {
  const facePattern = new RegExp(args.facePattern + ': ')

  return function tokenizeMedia(remainingText: string): boolean {
    const consumer = new TextConsumer(remainingText)

    const hasOpeningBracketAndFace =
      consumer.consumeIfMatches('[')
      && consumer.consumeIfMatchesPattern({ pattern: facePattern })

    if (!hasOpeningBracketAndFace) {
      return false
    }

    return false
  }
}
