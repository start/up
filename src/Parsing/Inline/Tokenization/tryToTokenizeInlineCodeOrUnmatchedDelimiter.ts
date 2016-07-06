import { regExpStartingWith, atLeast, anyCharBut } from '../../PatternHelpers'
import { InlineTextConsumer } from './InlineTextConsumer'
import { TokenKind } from './TokenKind'
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
// delimiters with a single space. This single space is trimmed away:
//
// ` ``inline_code`` `
//
// Anything beyond that single space is preserved. If there are two spaces between the delimiter
// and the starting/ending backticks, only one is trimmed away.
//
// Furthermore, that single space is only trimmed when it's needed to separate a delimiter from
// backticks. If a given "side" of inline code doesn't have any backticks that require separation
// from the delimiter, nothing gets trimmed from that side.
export function tryToTokenizeInlineCodeOrUnmatchedDelimiter(
  args: {
    text: string
    then: (resultToken: Token, lengthConsumed: number) => void
  }
): boolean {
  const { text, then } = args
  const consumer = new InlineTextConsumer(text)

  let startDelimiter: string

  consumer.consume({
    pattern: INLINE_CODE_DELIMITER,
    thenBeforeAdvancingTextIndex: match => { startDelimiter = match }
  })

  if (!startDelimiter) {
    return false
  }

  let inlineCode = ''

  while (!consumer.done()) {
    consumer.consume({
      pattern: CONTENT_THAT_CANNOT_CLOSE_INLINE_CODE,
      thenBeforeAdvancingTextIndex: match => { inlineCode += match }
    })

    // Alright, we've consumed a chunk of inline code. Either we've reached the end of the text,
    // or we're up against a possible end delimiter.

    let possibleEndDelimiter: string

    consumer.consume({
      pattern: INLINE_CODE_DELIMITER,
      thenBeforeAdvancingTextIndex: match => { possibleEndDelimiter = match }
    })

    if (!possibleEndDelimiter) {
      // Looks like we reached the end of the text. Let's bail.
      break
    }

    if (possibleEndDelimiter.length === startDelimiter.length) {
      then(new Token(TokenKind.InlineCode, inlineCode), consumer.textIndex)
      return true
    }

    inlineCode += possibleEndDelimiter
  }

  // We couldn't find a matching end delimiter, so there's nothing left to do but treat the
  // start delimiter as plain text.
  then(new Token(TokenKind.PlainText, startDelimiter), startDelimiter.length)
  return true
}


const INLINE_CODE_DELIMITER_CHAR =
  '`'

const CONTENT_THAT_CANNOT_CLOSE_INLINE_CODE =
  regExpStartingWith(
    atLeast(1, anyCharBut(INLINE_CODE_DELIMITER_CHAR)))

const INLINE_CODE_DELIMITER =
  regExpStartingWith(
    atLeast(1, INLINE_CODE_DELIMITER_CHAR))
