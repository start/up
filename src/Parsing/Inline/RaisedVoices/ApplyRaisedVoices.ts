import { Token } from '.././Tokens/Token'
import { RaisedVoiceMarker, comapreMarkersDescending } from './RaisedVoiceMarker'
import { StartMarker } from './StartMarker'
import { EndMarker } from './EndMarker'
import { PlainTextMarker } from './PlainTextMarker'
import { PotentialRaisedVoiceToken } from '../Tokens/PotentialRaisedVoiceToken'
import { PotentialRaisedVoiceEndToken } from '../Tokens/PotentialRaisedVoiceEndToken'
import { PotentialRaisedVoiceStartOrEndToken } from '../Tokens/PotentialRaisedVoiceStartOrEndToken'
import { PotentialRaisedVoiceStartToken } from '../Tokens/PotentialRaisedVoiceStartToken'

// TODO: Rename marker classes

export function applyRaisedVoices(tokens: Token[]): Token[] {
  const raisedVoiceMarkers = getRaisedVoiceMarkers(tokens)
  
  // Hooray! We've determined which raised voice tokens to produce!
  //
  // Now, let's replace the placeholder "PotentialRaisedVoice..." tokens with the real ones.
  const resultTokens = tokens.slice()
  
  for (const raisedVoiceMarker of raisedVoiceMarkers.sort(comapreMarkersDescending)) {
    resultTokens.splice(raisedVoiceMarker.originalTokenIndex, 1, ...raisedVoiceMarker.tokens())
  }
  
  return resultTokens
}

function getRaisedVoiceMarkers(tokens: Token[]): RaisedVoiceMarker[] {
  const markers: RaisedVoiceMarker[] = []

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]

    const canStartConvention = (
      token instanceof PotentialRaisedVoiceStartToken
      || token instanceof PotentialRaisedVoiceStartOrEndToken
    )

    const canEndConvention = (
      token instanceof PotentialRaisedVoiceEndToken
      || token instanceof PotentialRaisedVoiceStartOrEndToken
    )

    const isPotentialRaisedVoiceToken = canStartConvention || canEndConvention

    if (!isPotentialRaisedVoiceToken) {
      continue
    }
    
    const { asterisks } = <PotentialRaisedVoiceToken>token

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
    // Lastly, if we fail to match a regular start marker (TokenMeaning.PotentialRaisedVoiceStart) to any end
    // markers, we immediately treat the marker as plain text.    

    if (canEndConvention) {
      const endMarker = new EndMarker(tokenIndex, asterisks)

      endMarker.matchAnyApplicableStartMarkers(markers)

      if (!endMarker.providesNoTokens()) {
        markers.push(endMarker)
        continue
      }
    }

    if (canStartConvention) {
      markers.push(new StartMarker(tokenIndex, asterisks))
    } else {
      // Well, we could neither start nor end any conventions using this marker, so we'll assume it was meant to
      // be plain text.
      markers.push(new PlainTextMarker(tokenIndex, asterisks))
    }
  }

  // If any of our markers failed to pan out (i.e. fail to provide any tokens), we have no choice but to assume
  // they were meant to be plain text.
  const withFailedMarkersTreatedAsPlainText =
    markers.map(marker =>
      marker.providesNoTokens()
        ? new PlainTextMarker(marker.originalTokenIndex, marker.originalAsterisks)
        : marker
    )

  return withFailedMarkersTreatedAsPlainText
}
