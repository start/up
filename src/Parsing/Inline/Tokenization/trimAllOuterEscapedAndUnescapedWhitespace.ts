import { escapeForRegex, patternStartingWith, patternEndingWith, everyOptional, optional, atLeastOne } from '../../PatternHelpers'
import { SOME_WHITESPACE, WHITESPACE_CHAR } from '../../PatternPieces'
import { ESCAPER_CHAR } from '../../Strings'


// For inline markup, any outer whitespace is considered meaningless, even when it's escaped.
export function trimAllOuterEscapedAndUnescapedWhitespace(markup: string): string {
  return markup
    .replace(ALL_LEADING_ESCAPED_AND_UNESCAPED_WHITESPACE_PATTERN, '')
    .replace(ALL_TRAILING_ESCAPED_AND_UNESCAPED_WHITESPACE_PATTERN, '')
}


// For now, the escaper character is always going to be a backslash, which requires escaping
// for inclusion in regular expressions. I don't know what other variable name to use here.
const ESCAPER =
  escapeForRegex(ESCAPER_CHAR)

const CHUNK_OF_POSSIBLY_ESCAPED_WHITESPACE =
  optional(ESCAPER) + SOME_WHITESPACE

const ALL_LEADING_ESCAPED_AND_UNESCAPED_WHITESPACE_PATTERN =
  patternStartingWith(
    atLeastOne(
      CHUNK_OF_POSSIBLY_ESCAPED_WHITESPACE))


// This next pattern requires some explaination.
//
// As a rule, escaper characters (i.e. backslashes) are only preserved when:
//
// 1. They are themselves escaped
// 2. They appear in inline code
//
// If a given backslash is not escaped, it escapes the following charatcer without being
// preserved itself. And if there is no following character (i.e. if the backslash was
// the last character in the markup), then the backslash is simply ignored.
//
// Our tokenizer respects those rules, and this pattern takes advantage of that.
//
// Let's look at the following example: "hello\  \  \". Ultimately, only "hello" should be
// preserved.
//
// Our pattern matches the trailing "  \  \", leaving "hello\" behind. But that's okay!
// The tokenizer will just ignore that trailing backslash, which is exactly what we want.
//
// Why don't we include a leading backslash in our pattern? Well, take a look at this
// example: "hello\\  \  \".
//
// If we included a leading backslash in our pattern, it would erroneously match the second
// backslash, which is escaped and thus should be preserved as plain text.
//
// And even if we were to perform a look-behind (a construct JavaScript lacks) to avoid
// matching any backslash preceded by another, then we'd erroneously *not* match the third
// backslash in this example: "hello\\\  \  \".
//
// In that example, the third backslash is preceded by the second, but the second backslash
// is escaped! So it doesn't actually escape the third backslash. The pattern would leave
// the backslash for the tokenizer to handle, just like the simpler pattern we're using.
const ALL_TRAILING_ESCAPED_AND_UNESCAPED_WHITESPACE_PATTERN =
  patternEndingWith(
    WHITESPACE_CHAR
    + everyOptional(CHUNK_OF_POSSIBLY_ESCAPED_WHITESPACE)
    + optional(ESCAPER))
