import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { Sandwich } from '../Sandwich'
import { TextConsumer } from '../../TextConsumer'
import { last, lastChar, swap } from '../../CollectionHelpers'
import { Token, TokenMeaning } from '.././Token'
import { FailureTracker } from '../FailureTracker'
import { applyBackslashEscaping } from '../../TextHelpers'
import { RaisedVoiceDelimiterIntention } from './RaisedVoiceDelimiterIntention'
import { IntentionToStartConventions } from './IntentionToStartConventions'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'



export class IntentionToEndConventions extends RaisedVoiceDelimiterIntention {
  private endTokenMeanings: TokenMeaning[] = []
  
  constructor(originalTokenIndex: number, originalValue: string) {
    super(originalTokenIndex, originalValue)
  }

  tokens(): Token[] {
      return this.endTokenMeanings.map(meaning => new Token(meaning))    
  }
  
  endEmphasis(startDelimiterIntention: IntentionToStartConventions): void {
    this.endTokenMeanings.push(TokenMeaning.EmphasisEnd)

    startDelimiterIntention.startEmphasis()
  }

  endStress(startDelimiterIntention: IntentionToStartConventions): void {
    this.endTokenMeanings.push(TokenMeaning.StressEnd)

    startDelimiterIntention.startStress()
  }
}


class IntentionForPlainText extends RaisedVoiceDelimiterIntention {
  tokens(): Token[] {
    return [new Token(TokenMeaning.PlainText, this.originalValue)]
  }
}