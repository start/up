import { EMPHASIS_CONVENTION, STRESS_CONVENTION, REVISION_DELETION_CONVENTION, REVISION_INSERTION_CONVENTION, SPOILER_CONVENTION, NSFW_CONVENTION, NSFL_CONVENTION, FOOTNOTE_CONVENTION, LINK_CONVENTION, PARENTHESIZED_CONVENTION, SQUARE_BRACKETED_CONVENTION, ACTION_CONVENTION } from '../RichConventions'
import { escapeForRegex, regExpStartingWith, solely, everyOptional, either, optional, atLeast, anyCharBut, exactly, followedBy, notFollowedBy, anyCharMatching, anyCharNotMatching, capture } from '../../PatternHelpers'
import { SOME_WHITESPACE, ANY_WHITESPACE, WHITESPACE_CHAR, DIGIT, ANY_CHAR } from '../../PatternPieces'
import { NON_BLANK_PATTERN } from '../../Patterns'
import { ESCAPER_CHAR } from '../../Strings'
import { AUDIO_CONVENTION, IMAGE_CONVENTION, VIDEO_CONVENTION } from '../MediaConventions'
import { UpConfig } from '../../../UpConfig'
import { RichConvention } from '../RichConvention'
import { MediaConvention } from '../MediaConvention'
import { nestOverlappingConventions } from './nestOverlappingConventions'
import { insertBracketsInsideBracketedConventions } from './insertBracketsInsideBracketedConventions'
import { last, concat, reversed } from '../../../CollectionHelpers'
import { Bracket } from './Bracket'
import { BRACKETS } from './Brackets'
import { FailedConventionTracker } from './FailedConventionTracker'
import { ConventionContext } from './ConventionContext'
import { TokenizerSnapshot } from './TokenizerSnapshot'
import { InlineTextConsumer } from './InlineTextConsumer'
import { TokenKind } from './TokenKind'
import { Token } from './Token'
import { EncloseWithinRichConventionArgs } from './EncloseWithinRichConventionArgs'
import { TokenizableConvention, OnConventionEvent } from './TokenizableConvention'
import { RaisedVoiceHandler } from './RaisedVoiceHandler'


export function tryToTokenizeInlineCodeOrDelimiter(
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
    thenBeforeAdvancingTextIndex: match => {
      startDelimiter = match
    }
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

    let possibleEndDelimiter: string

    const foundPossibleEndDelimiter = consumer.consume({
      pattern: INLINE_CODE_DELIMITER,
      thenBeforeAdvancingTextIndex: match => { possibleEndDelimiter = match }
    })

    if (!foundPossibleEndDelimiter) {
      break
    }

    if (possibleEndDelimiter.length === startDelimiter.length) {
      then(new Token(TokenKind.InlineCode, inlineCode.trim()), consumer.textIndex)
      return true
    }

    inlineCode += possibleEndDelimiter
  }

  then(new Token(TokenKind.PlainText, startDelimiter), startDelimiter.length)
  return true
}


const INLINE_CODE_DELIMITER_CHAR =
  '`'

const CONTENT_THAT_CANNOT_CLOSE_INLINE_CODE =
  regExpStartingWith(
    atLeast(1, anyCharBut(INLINE_CODE_DELIMITER_CHAR)))

const INLINE_CODE_DELIMITER =
  regExpStartingWith(atLeast(1, INLINE_CODE_DELIMITER_CHAR))
