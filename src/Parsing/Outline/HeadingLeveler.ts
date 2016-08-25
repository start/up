import { distinct } from '../../CollectionHelpers'


// Instances of this class can track of which underline and overline characters are
// associated with which heading level.
export class HeadingLeveler {
  private headingFingerprints: string[] = []

  registerUnderlineAndGetLevel(underline: string, _overline: string): number {
    // TODO: Incorporate overline in fingerprint
    const headingFingerprint =
      fingerprint(underline)

    const hasCombinationOfUnderlineAndOverlineAlreadyBeenUsed =
      this.headingFingerprints.some(previousHash => previousHash === headingFingerprint)

    if (!hasCombinationOfUnderlineAndOverlineAlreadyBeenUsed) {
      this.headingFingerprints.push(headingFingerprint)
    }

    return this.getLevel(headingFingerprint)
  }

  private getLevel(underlineHash: string): number {
    return this.headingFingerprints.indexOf(underlineHash) + 1
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
