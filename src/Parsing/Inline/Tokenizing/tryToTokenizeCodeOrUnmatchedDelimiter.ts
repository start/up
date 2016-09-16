import { patternStartingWith, patternEndingWith, oneOrMore, anyCharBut } from '../../../PatternHelpers'
import { TextConsumer } from './TextConsumer'
import { TokenRole } from '../TokenRole'
import { Token } from './Token'


// Text surrounded on either side by an equal number of backticks is treated as inline code.
//
// Inline code can contain streaks of backticks that aren't exactly as long as the delimiters.
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
export function tryToTokenizeCodeOrUnmatchedDelimiter(
  args: {
    markup: string
    then: (resultToken: Token, lengthConsumed: number) => void
  }
): boolean {
  const { markup, then } = args
  const markupConsumer = new TextConsumer(markup)

  let startDelimiter: string

  markupConsumer.consume({
    pattern: CODE_DELIMITER_PATTERN,
    thenBeforeConsumingText: match => {
      startDelimiter = match
    }
  })

  if (!startDelimiter) {
    return false
  }

  let code = ''

  while (!markupConsumer.done()) {
    markupConsumer.consume({
      pattern: CONTENT_THAT_CANNOT_CLOSE_CODE_PATTERN,
      thenBeforeConsumingText: match => {
        code += match
      }
    })

    // Alright, we've consumed a chunk of inline code. Either we've reached the end of the markup,
    // or we're up against a possible end delimiter.

    let possibleEndDelimiter: string

    markupConsumer.consume({
      pattern: CODE_DELIMITER_PATTERN,
      thenBeforeConsumingText: match => {
        possibleEndDelimiter = match
      }
    })

    if (!possibleEndDelimiter) {
      // Looks like we reached the end of the markup. Let's bail.
      break
    }

    if (possibleEndDelimiter === startDelimiter) {
      then(new Token(TokenRole.Code, trimCode(code)), markupConsumer.index)
      return true
    }

    code += possibleEndDelimiter
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


const CODE_DELIMITER_CHAR =
  '`'

const CONTENT_THAT_CANNOT_CLOSE_CODE_PATTERN =
  patternStartingWith(
    oneOrMore(anyCharBut(CODE_DELIMITER_CHAR)))

const CODE_DELIMITER_PATTERN =
  patternStartingWith(
    oneOrMore(CODE_DELIMITER_CHAR))

const ONE_OR_MORE_SPACES =
  oneOrMore(' ')

const LEADING_SPACE_WAS_USED_FOR_SEPARATION_PATTERN =
  patternStartingWith(
    ONE_OR_MORE_SPACES + CODE_DELIMITER_CHAR)

const TRAILING_SPACE_WAS_USED_FOR_SEPARATION_PATTERN =
  patternEndingWith(
    CODE_DELIMITER_CHAR + ONE_OR_MORE_SPACES)
