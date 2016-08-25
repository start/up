import { distinct } from '../../CollectionHelpers'


// Instances of this class can track of which underline and overline characters are
// associated with which heading level.
export class HeadingLeveler {
  private headingFingerprints: string[] = []

  registerUnderlineAndGetLevel(underline: string, overline: string): number {
    // Alright, this requires some explanation.
    //
    // First of all, we're going to assume that `underline` and `overline` obey the
    // rules and both consist of the same combination of characters.
    //
    // As explained in `tryToParseHeading.ts`:
    //
    // 1. Headings with the same same combination of underline characters share the
    //    same level
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
    // Hence this weird fingerprint. 
    const headingFingerprint =
      fingerprint(underline) + (overline ? 'with overline' : '')

    const hasCombinationOfUnderlineAndOverlineAlreadyBeenUsed =
      this.headingFingerprints.some(previousHash => previousHash === headingFingerprint)

    if (!hasCombinationOfUnderlineAndOverlineAlreadyBeenUsed) {
      this.headingFingerprints.push(headingFingerprint)
    }

    return this.getLevel(headingFingerprint)
  }

  private getLevel(headingFingerpring: string): number {
    return this.headingFingerprints.indexOf(headingFingerpring) + 1
  }
}


export function isUnderlineConsistentWithOverline(overline: string, underline: string): boolean {
  return !overline || (fingerprint(overline) === fingerprint(underline))
}


// Returns a string containing only the distinct characters from trimmed `text`, sorted
// according to the characters' Unicode code points.
//
// For example, when `text` is " =-~-=-~-=-~-= ", this function returns "-=~".
function fingerprint(text: string): string {
  const chars =
    text.trim().split('')

  return distinct(...chars).sort().join('')
}
