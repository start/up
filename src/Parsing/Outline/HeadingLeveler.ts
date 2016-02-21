export class HeadingLeveler {
  private registeredUnderlineChars: string[] = []
  
  registerAndGetLevel(underline: string): number {
    const underlineChars = getDistinctStreakChars(underline)
    
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

export function isUnderlineConsistentWithOverline(overline: string, underline: string): boolean {
    return !overline || (getDistinctStreakChars(overline) === getDistinctStreakChars(underline))
}

function getDistinctStreakChars(streak: string): string {
  const allStreakChars = streak.trim().split('')

  const distinctUnderlineChars =
    allStreakChars
      .reduce((distinctChars, char) => {
        const haveAlreadySeenChar = distinctChars.some((distinctChar) => distinctChar === char)
        return (
          haveAlreadySeenChar
            ? distinctChars
            : distinctChars.concat([char]))
      }, [])

  return distinctUnderlineChars.sort().join('')
}