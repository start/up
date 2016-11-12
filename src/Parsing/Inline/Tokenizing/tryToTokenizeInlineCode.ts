import { patternStartingWith, patternEndingWith, oneOrMore } from '../../../PatternHelpers'
import { BACKSLASH } from '../../Strings'
import { TextConsumer, MatchResult } from './TextConsumer'
import { TokenRole } from '../TokenRole'
import { Token } from './Token'


// Text surrounded on either side by an equal number of backticks is treated as inline code.
// 
// If `markup` starts with inline code, this function tokenizes it, ultimately producing an
// `InlineCode` token. If `markup` instead starts with an unmatched inline code start delimiter
// (i.e. streak of backticks), this function produces a text token for that unmatched delimiter.
// Otherwise, thie method does nothing.
//
// Within inline code, backticks can be escaped with a backslash. That being said, inline code can
// contain streaks of *unescaped* backticks that aren't exactly as long as the delimiters.
//
// In this example, the delimiters are 1 backtick long, so the inline code can contain streaks of
// 2 backticks:
//
// `let display = ``score:`` + 5`
//
// In this example, the delimiters are 2 backticks long, so the inline code can contain "streaks"
// of 1 backtick:
//
// ``let display = `score:` + 5``
//
// Delimiters can be any length.
//
// Like (outline) code blocks, backslashes are treated as regular characters within inline code,
// which means backticks within inline code cannot be escaped (hence the fancy delimiter syntax).
//
// If inline code needs to start or end with backticks, those backticks can be separated from the
// outer delimiters by a single space. This single space is trimmed away:
//
// ` ``inline_code`` `
//
// Anything beyond that single space is preserved. If there are two spaces between the delimiter
// and the starting/ending backticks, only one is trimmed away.
//
// Furthermore, that single space is only trimmed away when it's used to separate a delimiter from
// backticks in the inline code. If a given "side" of inline code has any non-whitespace characters
// between the delimiter and the first backtick, nothing gets trimmed from that side.    
export function tryToTokenizeInlineCode(
  args: {
    markup: string
    then: (inlineCodeToken: Token, lengthConsumed: number) => void
  }
): boolean {
  const { markup, then } = args
  const markupConsumer = new TextConsumer(markup)

  const startDelimiterResult = markupConsumer.consume(DELIMITER_PATTERN)

  if (!startDelimiterResult) {
    return false
  }

  const startDelimiter = startDelimiterResult.match
  let inlineCode = ''

  COLLECT_INLINE_CODE: while (!markupConsumer.done) {
    // First, lets collect all inline code up to the first unescaped backtick. That backtick might
    // not terminate our inline code, but we'll find that out later!
    while (markupConsumer.currentChar !== BACKTICK) {
      if (markupConsumer.currentChar === BACKSLASH) {
        markupConsumer.index += 1
      }

      if (markupConsumer.done) {
        break COLLECT_INLINE_CODE
      }

      inlineCode += markupConsumer.currentChar
      markupConsumer.index += 1
    }

    // We're up against a possible end delimiter. If it doesn't match our start delimiter, we'll
    // simply include it in our inline code.
    //
    // We can safely cast to a non-nullable `MatchResult` because we know we must be up against a
    // backtick (thanks to the fact that the above loop terminated). Therefore, `DELIMITER_PATTERN`
    // is guaranteed to find a match. 
    const possibleEndDelimiter =
      (markupConsumer.consume(DELIMITER_PATTERN) as MatchResult).match

    if (startDelimiter === possibleEndDelimiter) {
      then(new Token(TokenRole.InlineCode, trimCode(inlineCode)), markupConsumer.index)
      return true
    }

    inlineCode += possibleEndDelimiter
  }

  // We couldn't find a matching end delimiter, so there's nothing left to do but treat the
  // start delimiter as plain text.
  then(new Token(TokenRole.Text, startDelimiter), startDelimiter.length)
  return true
}


function trimCode(code: string): string {
  if (LEADING_SPACE_WAS_USED_FOR_SEPARATION_PATTERN.test(code)) {
    code = code.slice(1)
  }

  if (TRAILING_SPACE_WAS_USED_FOR_SEPARATION_PATTERN.test(code)) {
    code = code.slice(0, -1)
  }

  return code
}


const BACKTICK =
  '`'

const DELIMITER_PATTERN =
  patternStartingWith(
    oneOrMore(BACKTICK))

const ONE_OR_MORE_SPACES =
  oneOrMore(' ')

const LEADING_SPACE_WAS_USED_FOR_SEPARATION_PATTERN =
  patternStartingWith(
    ONE_OR_MORE_SPACES + BACKTICK)

const TRAILING_SPACE_WAS_USED_FOR_SEPARATION_PATTERN =
  patternEndingWith(
    BACKTICK + ONE_OR_MORE_SPACES)
