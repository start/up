import { WHITESPACE_CHAR_PATTERN } from '../../../Patterns'
import { BACKSLASH } from '../../Strings'


// For inline markup, any outer whitespace is considered meaningless, even when it's escaped.
// This function strips it all away.
export function trimEscapedAndUnescapedOuterWhitespace(markup: string): string {
  // Note: To avoid catastrophic slowdown, we don't use a single regular expression for this. For more
  // information, please see: http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016

  // Let's review the rules!
  //
  // Backslashes are only preserved when:
  //
  // 1. They are themselves escaped
  // 2. They appear in inline code
  //
  // If a given backslash is not escaped, it escapes the following charatcer without being
  // preserved itself. And if there is no following character (i.e. if the backslash was
  // the last character in the markup), then the backslash is simply ignored.
  while (true) {
    markup = markup.trim()

    // We've trimmed away the outer layer of unescaped whitespace, but we haven't touched the outer
    // layer of escaped whitespace, if there is any.  If there isn't any, we know we're done.
    const { length } = markup

    const isFirstCharEscapingWhitespace =
      markup[0] === BACKSLASH
      && (
        markup.length === 1
        || WHITESPACE_CHAR_PATTERN.test(markup[1])
      )

    if (isFirstCharEscapingWhitespace) {
      // Let's trim away both the backslash and the single whitespace character it escapes.
      markup = markup.slice(2)
    }

    const secondToLastChar = markup[length - 2]
    const lastChar = markup[length - 1]

    if ((lastChar === BACKSLASH) && (secondToLastChar !== BACKSLASH)) {
      // This will trim away the final backslash, even if there isn't any whitespace before it.
      // That's fine! As discussed above, unless a trailing backslash is escaped, it should be
      // ignored.
      //
      // However, let's say the markup is "hello\\\". In this case, the last backslash isn't
      // escaped, because the preceding backslash is *itself* escaped! This function makes no
      // attempt to resolve those cases. The tokenizer will take care of that just fine.
      markup = markup.slice(0, -1)
    }

    if (markup.length === length) {
      // There was no outer escaped whitespace, so there's nothing more for us to do.
      return markup
    }
  }
}
