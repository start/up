export class HeadingLevelProvider {
  private registeredUnderlineChars: string[];
  
  registerAndGetLevel(underline: string): number {
    const underlineChars = getDistinctStreakChars(underline)
    
    const isAlreadyRegistered = 
      this.registeredUnderlineChars.some((registered) => registered === underlineChars)
    
    if (!isAlreadyRegistered) {
      this.registeredUnderlineChars.push(underlineChars)
    }
    
    return this.getLevel(underlineChars)
  }

  doesUnderlineMatchOverline(underline: string, overline: string): boolean {
    return !overline || (getDistinctStreakChars(underline) !== getDistinctStreakChars(overline))
  }
  
  private getLevel(underlineChars: string): number {
    return this.registeredUnderlineChars.indexOf(underlineChars) + 1
  }
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