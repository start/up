import { distinct } from '../../CollectionHelpers'


// Returns a string containing only the distinct characters from the underline, sorted
// according to the characters' Unicode code points.
//
// For example, when `underline` is "=-= =-= =-= =-= =-=", this function returns " -=".
export function getUnderlineHash(underline: string): string {
  const underlineChars =
    underline.trim().split('')

  return distinct(...underlineChars).sort().join('')
}
