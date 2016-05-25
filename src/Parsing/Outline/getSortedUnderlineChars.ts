export function getSortedUnderlineChars(underline: string): string {
  return underline
    .trim()
    .split('')
    .reduce((distinctChars, char) =>
      (distinctChars.indexOf(char) !== -1)
        ? distinctChars
        : distinctChars.concat([char])
    , [])
    .sort()
    .join('')
}
