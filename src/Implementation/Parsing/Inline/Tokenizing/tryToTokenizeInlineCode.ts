import { oneOrMore, patternEndingWith, patternStartingWith } from '../../../PatternHelpers'
import { BACKSLASH } from '../../Strings'
import { TokenRole } from '../TokenRole'
import { MatchResult, TextConsumer } from './TextConsumer'
import { Token } from './Token'

type InlineCodeTokenizationResult = null | {
    inlineCodeOrTextToken: Token,
    lengthConsumed: number
}

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
export function tryToTokenizeInlineCode(markup: string): InlineCodeTokenizationResult {
  const markupConsumer = new TextConsumer(markup)

  const startDelimiterResult = markupConsumer.consume(DELIMITER_PATTERN)

  if (!startDelimiterResult) {
    return null
  }

  const startDelimiter = startDelimiterResult.match
  let inlineCode = ''

  COLLECT_INLINE_CODE: while (!markupConsumer.done()) {
    // First, lets collect all inline code up to the first unescaped backtick. That backtick might
    // not terminate our inline code, but we'll find that out later!
    while (markupConsumer.currentChar() !== BACKTICK) {
      if (markupConsumer.currentChar() === BACKSLASH) {
        markupConsumer.advanceIndex(1)
      }

      if (markupConsumer.done()) {
        break COLLECT_INLINE_CODE
      }

      inlineCode += markupConsumer.currentChar()
      markupConsumer.advanceIndex(1)
    }

    // We're up against a possible end delimiter. If it doesn't match our start delimiter, we'll
    // simply include it in our inline code.
    //
    // We can safely cast to a non-nullable `MatchResult` because we know we must be up against a
    // backtick (thanks to the fact that the above loop terminated without breaking out of the
    // `COLLECT_INLINE_CODE` loop). Therefore, `DELIMITER_PATTERN` is guaranteed to find a match.
    const possibleEndDelimiter =
      (markupConsumer.consume(DELIMITER_PATTERN) as MatchResult).match

    if (possibleEndDelimiter === startDelimiter) {
      return {
        inlineCodeOrTextToken: new Token(TokenRole.InlineCode, trimCode(inlineCode)),
        lengthConsumed: markupConsumer.index()
      }
    }

    inlineCode += possibleEndDelimiter
  }

  // We couldn't find a matching end delimiter, so there's nothing left to do but treat the
  // start delimiter as plain text.
  return {
    inlineCodeOrTextToken: new Token(TokenRole.Text, startDelimiter),
    lengthConsumed: startDelimiter.length
  }
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
