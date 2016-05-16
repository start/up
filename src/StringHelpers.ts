export function getDistinctTrimmedChars(text: string): string {
  return text
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