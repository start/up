import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { InlineTextConsumer } from '../InlineTextConsumer'
import { last, lastChar, swap } from '../../CollectionHelpers'
import { Token, TokenMeaning } from '.././Token'
import { FailureTracker } from '../FailureTracker'
import { applyBackslashEscaping } from '../../TextHelpers'
import { RaisedVoiceMarker, comapreMarkersDescending } from './RaisedVoiceMarker'
import { StartMarker } from './StartMarker'
import { EndMarker } from './EndMarker'
import { PlainTextMarker } from './PlainTextMarker'


export function applyRaisedVoices(tokens: Token[]): Token[] {
  const markers = getMarkers(tokens)
  
  return replacePlaceholderTokens(tokens, markers)
}


function getMarkers(tokens: Token[]): RaisedVoiceMarker[] {
  const markers: RaisedVoiceMarker[] = []

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

    const isTokenRelevant = canStartConvention || canEndConvention

    if (!isTokenRelevant) {
      continue
    }

    // A given raised voice marker will serve only 1 of 3 roles:
    //
    // 1. End 1 or more conventions
    // 2. Start 1 or more conventions
    // 3. Be treated as plain text (as a last resort)
    //
    // If a marker has the potential to either start *or* end conventions (represented by a token with the meaning 
    // TokenMeaning.PotentialRaisedVoiceStartOrEnd), we initially treat it as an end marker. If we fail to match
    // it with any start markers, we then treat it as a start marker, hoping we can subsequently match it with
    // at least one end marker. If this fails, we then treat the marker as plain text.
    //
    // On the other hand, if we fail to match a regular end marker (TokenMeaning.PotentialRaisedVoiceEnd) to any
    // start markers, we immediately treat the marker as plain text.
    //
    // LAstly, if we fail to match a regular start marker (TokenMeaning.PotentialRaisedVoiceStart) to any end
    // markers, we immediately treat the dlimiter as plain text.    

    if (canEndConvention) {
      const endMarker = new EndMarker(tokenIndex, value)

      endMarker.matchAnyApplicableStartMarkers(markers)

      if (!endMarker.providesNoTokens()) {
        markers.push(endMarker)
        continue
      }
    }

    if (canStartConvention) {
      markers.push(new StartMarker(tokenIndex, value))
    } else {
      // Well, we could neither start nor end any conventions using this marker, so we'll assume it was meant to
      // be plain text.
      markers.push(new PlainTextMarker(tokenIndex, value))
    }
  }

  // If any of our markers failed to pan out (i.e. fail to provide any tokens), we have no choice but to assume
  // they were meant to be plain text.
  const withFailedMarkersTreatedAsPlainText =
    markers.map(marker =>
      marker.providesNoTokens()
        ? new PlainTextMarker(marker.originalTokenIndex, marker.originalValue)
        : marker
    )

  return withFailedMarkersTreatedAsPlainText
}


function replacePlaceholderTokens(tokens: Token[], markers: RaisedVoiceMarker[]): Token[] {
  // We could probably be naughty and modify the `tokens` collection directly without anyone noticing.
  const resultTokens = tokens.slice()

  for (const marker of markers.sort(comapreMarkersDescending)) {
    resultTokens.splice(marker.originalTokenIndex, 1, ...marker.tokens())
  }

  return resultTokens
}
