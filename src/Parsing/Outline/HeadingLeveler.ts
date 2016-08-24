import { getUnderlineHash } from './getUnderlineHash'


// Keeps track of which underline characters are associated with which heading level.
export class HeadingLeveler {
  private previousUnderlineHashes: string[] = []

  registerUnderlineAndGetLevel(underline: string): number {
    const hash = getUnderlineHash(underline)

    const hasUnderlineAlreadyBeenUsed =
      this.previousUnderlineHashes.some(previousHash => previousHash === hash)

    if (!hasUnderlineAlreadyBeenUsed) {
      this.previousUnderlineHashes.push(hash)
    }

    return this.getLevel(hash)
  }

  private getLevel(underlineHash: string): number {
    return this.previousUnderlineHashes.indexOf(underlineHash) + 1
  }
}
