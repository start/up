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
import { RaisedVoiceDelimiter, compareDelimitersDecending } from './RaisedVoiceDelimiter'
import { StartDelimiter } from './StartDelimiter'
import { EndDelimiter } from './EndDelimiter'
import { PlainTextDelimiter } from './PlainTextDelimiter'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'


export function applyRaisedVoices(tokens: Token[]): Token[] {
  const delimiters = getDelimiters(tokens)
  
  return replacePlaceholderTokens(tokens, delimiters)
}


function getDelimiters(tokens: Token[]): RaisedVoiceDelimiter[] {
  const delimiters: RaisedVoiceDelimiter[] = []

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    const {meaning, value} = token

    const canStartConvention = (
      meaning === TokenMeaning.PotentialRaisedVoiceStart
      || meaning === TokenMeaning.PotentialRaisedVoiceStartOrEnd
    )

    const canEndConvention = (
      meaning === TokenMeaning.PotentialRaisedVoiceEnd
      || meaning === TokenMeaning.PotentialRaisedVoiceStartOrEnd
    )

    if (canEndConvention) {
      const endDelimiter = new EndDelimiter(tokenIndex, value)
      
      endDelimiter.matchAnyApplicableStartDelimiters(delimiters)

      if (!endDelimiter.providesNoTokens()) {
        delimiters.push(endDelimiter)
        continue
      }
    }

    if (canStartConvention) {
      delimiters.push(new StartDelimiter(tokenIndex, value))
    } else {
      // Well, we could neither start nor end any conventions using this delimiter, so we'll assume it was meant to
      // be plain text.
      delimiters.push(new PlainTextDelimiter(tokenIndex, value))
    }
  }

  // If any of our delimiters failed to pan out (i.e. fail to provide any tokens), we have no choice but to assume
  // they were meant to be plain text.
  const withFailedDelimitersTreatedAsPlainText =
    delimiters.map(delimiter =>
      delimiter.providesNoTokens()
        ? new PlainTextDelimiter(delimiter.originalTokenIndex, delimiter.originalValue)
        : delimiter
    )

  return withFailedDelimitersTreatedAsPlainText
}


function replacePlaceholderTokens(tokens: Token[], delimiters: RaisedVoiceDelimiter[]): Token[] {
  // We could probably be naughty and modify the `tokens` collection directly without anyone noticing.
  const resultTokens = tokens.slice()

  for (const delimiter of delimiters.sort(compareDelimitersDecending)) {
    tokens.splice(delimiter.originalTokenIndex, 1, ...delimiter.tokens())
  }

  return resultTokens
}

