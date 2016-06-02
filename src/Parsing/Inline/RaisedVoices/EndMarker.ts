import { Token } from '.././Token'
import { TokenKind } from '.././TokenKind'
import { RaisedVoiceMarker } from './RaisedVoiceMarker'
import { StartMarker } from './StartMarker'


export class EndMarker extends RaisedVoiceMarker {
  tokens(): Token[] {
    return this.tokenKinds.map(kind => new Token(kind))
  }

  matchAnyApplicableStartMarkers(markers: RaisedVoiceMarker[]): void {
    const availableStartMarkersFromMostRecentToLeast = <StartMarker[]>(
      markers
        .filter(marker => (marker instanceof StartMarker) && !marker.isFullyMatched())
        .reverse()
    )
    
    if (this.canOnlyIndicateEmphasis()) {
      
      // If an end marker has only 1 asterisk available to spend, it can only indicate (i.e. afford) emphasis.
      //
      // For these end markers, we want to prioritize matching with the nearest start marker that either:
      //
      // 1. Can also only indicate emphasis (1 asterisk to spend)
      // 2. Can indicate both emphasis and stress together (3+ asterisks to spend)
      //
      // If we can't find any start markers that satisfy the above criteria, then we'll settle for a start marker
      // that has 2 asterisks to spend. But this fallback happens later.
      
      for (const startMarker of availableStartMarkersFromMostRecentToLeast) {
        if (startMarker.canOnlyIndicateEmphasis() || startMarker.canIndicateStressAndEmphasisTogether()) {
          this.endEmphasis(startMarker)

          // Considering we could only afford to indicate emphasis, we have nothing left to do.
          return
        }
      }
    } else if (this.canIndicateStressButNotBothTogether()) {
      
      // If an end marker has only 2 asterisks to spend, it can indicate stress, but it can't indicate both stress
      // and emphasis at the saem time.
      //
      // For these end markers, we want to prioritize matching with the nearest start marker that can indicate
      // stress. It's okay if that start marker can indicate both stress and emphasis at the same time! As long
      // as it can indicate stress, we're good. 
      //
      // Only if we can't find one, then we'll match with a marker that has just 1 asterisk to spend. But this
      // fallback happens later.
      
      for (const startMarker of availableStartMarkersFromMostRecentToLeast) {
        if (startMarker.canIndicateStress()) {
          this.endStress(startMarker)
          
          // Considering we could only afford to indicate stress, we have nothing left to do.
          return
        }
      }
    }
    
    // From here on out, if this end marker can match with a start marker, it will. It'll try to match as
    // many asterisks at once as it can.
    
    for (const startMarker of availableStartMarkersFromMostRecentToLeast) {
      if (this.isFullyMatched()) {
        // Once this marker has matched all of its asterisks, its work is done. Let's bail.
        break
      }

      if (this.canIndicateStressAndEmphasisTogether() && startMarker.canIndicateStressAndEmphasisTogether()) {
        this.startStressAndEmphasisTogether(startMarker)
        continue
      }

      if (this.canIndicateStress() && startMarker.canIndicateStress()) {
        this.endStress(startMarker)
        continue
      }

      if (this.canIndicateEmphasis() && startMarker.canIndicateEmphasis()) {
        this.endEmphasis(startMarker)
        continue
      }
    }
  }

  private startStressAndEmphasisTogether(startMarker: StartMarker): void {
    // When matching markers each have 3 or more asterisks to spend, their contents become stressed and emphasized,
    // and they cancel out as many of each other's asterisks as possible.
    //
    // Therefore, surrounding text with 3 asterisks has the same effect as surrounding text with 10.
    //
    // To be clear, any unmatched asterisks are *not* canceled, and they remain available to be subsequently matched
    // with other markers.
    const countAsterisksInCommonWithStartMarker =
      Math.min(this.countSurplusAsterisks, startMarker.countSurplusAsterisks)

    this.payForStressAndEmphasisTogether(countAsterisksInCommonWithStartMarker)
    this.tokenKinds.push(TokenKind.EmphasisEnd)
    this.tokenKinds.push(TokenKind.StressEnd)

    startMarker.startStressAndEmphasisTogether(countAsterisksInCommonWithStartMarker)
  }

  private endStress(startMarker: StartMarker): void {
    this.payForStress()
    this.tokenKinds.push(TokenKind.StressEnd)

    startMarker.startStress()
  }

  private endEmphasis(startMarker: StartMarker): void {
    this.payForEmphasis()
    this.tokenKinds.push(TokenKind.EmphasisEnd)

    startMarker.startEmphasis()
  }
}
