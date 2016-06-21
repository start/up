import { getSortedUnderlineChars } from './getSortedUnderlineChars' 


// Keeps track of which underline characters are associated with which heading level.
export class HeadingLeveler {
  private registeredUnderlineChars: string[] = []

  registerUnderlineAndGetLevel(underline: string): number {
    const underlineChars = getSortedUnderlineChars(underline)

    const isAlreadyRegistered =
      this.registeredUnderlineChars.some((registered) => registered === underlineChars)

    if (!isAlreadyRegistered) {
      this.registeredUnderlineChars.push(underlineChars)
    }

    return this.getLevel(underlineChars)
  }

  private getLevel(underlineChars: string): number {
    return this.registeredUnderlineChars.indexOf(underlineChars) + 1
  }
}
