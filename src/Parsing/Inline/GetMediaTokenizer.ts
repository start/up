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
    
    // We've found the opening bracket and the face. Now, let's get the media's description.
    let description: string
    
      const didFindDescription = consumer.consume({
        upTo: ' -> ',
        then: match => description = applyBackslashEscaping(match)
      })
      
      if (!didFindDescription) {
        return false
      }
      
   // Finally, let's find the closing bracket and go home.
          let url: string
    
      const didFindClosingBracket = consumer.consume({
        upTo: ' -> ',
        then: match => description = applyBackslashEscaping(match)
      })
      
      if (!didFindClosingBracket) {
        return false
      }
      
      
    return true
  }
}
