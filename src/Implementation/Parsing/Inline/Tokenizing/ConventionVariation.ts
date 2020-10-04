import { patternIgnoringCapitalizationAndStartingWith, patternStartingWith } from '../../../PatternHelpers'
import { TokenRole } from '../TokenRole'
import { ConventionContext } from './ConventionContext'


// The start/end delimiters of a convention variation are ultimately represented by
// RegExp patterns anchored to the beginning of the input string (using `^`).
//
// For convenience, the ConventionVariation constructor instead accepts unanchored
// string patterns for those delimiters. (Those strings are then converted into
// anchored RegExp patterns.)

type StringDelimiters = {
  startsWith: string
  endsWith?: string
}

export type ConventionVariationArgs =
  Omit<ConventionVariation, keyof StringDelimiters> & StringDelimiters


// This represents the rules for a single variation of an inline writing convention.
// For example: an inline revealable convention delimited by square brackets.
export class ConventionVariation {
  startsWith: RegExp
  endsWith?: RegExp
  canOnlyOpenIfDirectlyFollowing?: TokenRole[]
  isCutShortByWhitespace?: boolean
  canConsistSolelyOfWhitespace?: boolean
  flushesBufferToTextTokenBeforeOpening?: boolean
  whenOpening?: (match: string, charAfterMatch: string, ...captures: string[]) => void
  insteadOfClosingOuterConventionsWhileOpen?: OnConventionEvent
  insteadOfOpeningRegularConventionsWhileOpen?: OnConventionEvent
  failsIfWhitespaceIsEnounteredBeforeClosing?: boolean
  beforeClosingItFlushesNonEmptyBufferTo?: TokenRole
  beforeClosingItAlwaysFlushesBufferTo?: TokenRole
  whenClosingItAlsoClosesInnerConventions?: boolean
  mustBeDirectlyFollowedBy?: ConventionVariation[]
  whenClosing?: OnConventionEvent
  insteadOfFailingWhenLeftUnclosed?: OnConventionEvent

  constructor(args: ConventionVariationArgs) {
    // First, let's blindly copy everything from `args` to `this`.
    //
    // Alas! This also copies the string `startsWith`/`endsWith` fields, too! We'll
    // overwrite those below.
    Object.assign(this, args)

    const { startsWith, endsWith } = args

    this.startsWith =
      // Some of our start delimiters can contain terms. As a rule, terms are
      // case-insensitive.
      //
      // Let's determine whether we need to worry about case sensitivity.
      startsWith.toLowerCase() != startsWith.toUpperCase()
        ? patternIgnoringCapitalizationAndStartingWith(startsWith)
        : patternStartingWith(startsWith)

    this.endsWith =
      endsWith
        ? patternStartingWith(endsWith)
        : undefined
  }
}


export type OnConventionEvent =
  (context: ConventionContext) => void

  