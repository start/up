import { regExpStartingWith, atLeast, anyCharBut } from '../../PatternHelpers'
import { InlineTextConsumer } from './InlineTextConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'


// Text surrounded on either side by an equal number of backticks is treated as inline code.
export function tryToTokenizeInlineCodeOrUnmatchedDelimiter(
  args: {
    text: string
    then: (resultToken: Token, lengthConsumed: number) => void
  }
): boolean {
  const { text, then } = args
  const consumer = new InlineTextConsumer(text)

  let startDelimiter: string

  const foundStartDelimiter = consumer.consume({
    pattern: INLINE_CODE_DELIMITER,
    thenBeforeAdvancingTextIndex: match => { startDelimiter = match }
  })

  if (!foundStartDelimiter) {
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

    const foundPossibleEndDelimiter = consumer.consume({
      pattern: INLINE_CODE_DELIMITER,
      thenBeforeAdvancingTextIndex: match => { possibleEndDelimiter = match }
    })

    if (!foundPossibleEndDelimiter) {
      // Looks like we reached the end of the text! Let's bail.
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
