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
import { RaisedVoiceDelimiter } from './RaisedVoiceDelimiter'
import { StartDelimiter } from './StartDelimiter'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'


export class EndDelimiter extends RaisedVoiceDelimiter {
  tokens(): Token[] {
    return this.tokenMeanings.map(meaning => new Token(meaning))
  }

  matchAnyApplicableStartDelimiters(delimiters: RaisedVoiceDelimiter[]): void {
    const startDelimitersFromMostToLeastRecent = <StartDelimiter[]>(
      delimiters
        .filter(delimiter => delimiter instanceof StartDelimiter)
        .reverse()
    )

    for (const startDelimiter of startDelimitersFromMostToLeastRecent) {
      // If the start delimiter can afford both stress and emphasis together, that means it has at least
      // 3 asterisks.
    }
  }

  private endEmphasis(startDelimiter: StartDelimiter): void {
    this.tokenMeanings.push(TokenMeaning.EmphasisEnd)

    startDelimiter.startEmphasis()
  }

  private endStress(startDeilmeter: StartDelimiter): void {
    this.tokenMeanings.push(TokenMeaning.StressEnd)

    startDeilmeter.startStress()
  }
}