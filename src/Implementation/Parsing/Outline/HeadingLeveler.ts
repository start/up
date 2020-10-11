import { distinct } from '../../CollectionHelpers'


// Instances of this class track of which underline and overline characters are
// associated with which heading level.
export class HeadingLeveler {
  private headingSignatures: string[] = []

  registerHeadingAndGetLevel(underline: string, hasOverline: boolean): number {
    // Yes, this requires some explanation!
    //
    // As mentioned in `tryToParseHeading.ts`:
    //
    // 1. Headings with the same combination of underline characters share the same
    //    level
    // 2. Headings with overlines are always considered distinct from headings without
    //    overlines, even if their underlines are the same. So a heading with an
    //    overline will never have the same level has a heading without an overline.
    //
    // Therefore, when determining the level of a given heading, we need just two
    // pieces of information:
    //
    // 1. The distinct characters in the underline
    // 2. Whether the heading has an overline
    //
    // These two pieces of information comprise a heading's signature, hence the
    // following weird line.
    const headingSignature =
      fingerprint(underline) + (hasOverline ? 'with overline' : '')

    const hasCombinationOfUnderlineAndOverlineAlreadyBeenUsed =
      this.headingSignatures.indexOf(headingSignature) !== -1

    if (!hasCombinationOfUnderlineAndOverlineAlreadyBeenUsed) {
      this.headingSignatures.push(headingSignature)
    }

    return this.getLevel(headingSignature)
  }

  private getLevel(headingSignature: string): number {
    return this.headingSignatures.indexOf(headingSignature) + 1
  }
}


export function isUnderlineConsistentWithOverline(underline: string, overline: string | null): boolean {
  return !overline || (fingerprint(underline) === fingerprint(overline))
}


// Returns a string containing only the distinct characters from trimmed `line`, sorted
// according to the characters' Unicode code points.
//
// For example, when `line` is " =-~-=-~-=-~-= ", this function returns "-=~".
function fingerprint(line: string): string {
  const chars =
    line.trim().split('')

  return distinct(...chars).sort().join('')
}
