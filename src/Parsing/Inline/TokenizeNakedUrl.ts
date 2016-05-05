import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { TextConsumer } from './TextConsumer'

import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { Token, TokenType } from './Tokens/Token'


interface TokenizeNakedUrlArgs {
  text: string,
  then: (lengthConsumed: number, tokens: Token[]) => void
}

export function tokenizeNakedUrl(args: TokenizeNakedUrlArgs): boolean {
  const consumer = new TextConsumer(args.text)

  const SCHEME_PATTERN = /^(?:https?)?:\/\//

  let urlScheme: string

  if (!consumer.consumeIfMatchesPattern({
    pattern: SCHEME_PATTERN,
    then: (match) => urlScheme = match
  })) {
    return false
  }

  const NON_WHITESPACE_CHAR_PATTERN = /^\S/

  let restOfUrl = ''

  // TODO: fix escaping

  while (consumer.consumeIfMatchesPattern({
    pattern: NON_WHITESPACE_CHAR_PATTERN,
    then: (char) => restOfUrl += char
  })) { }

  if (!restOfUrl) {
    return false
  }

  const tokens = [
    new LinkStartToken(),
    new PlainTextToken(restOfUrl),
    new LinkEndToken(urlScheme + restOfUrl)
  ]

  args.then(consumer.lengthConsumed(), tokens)
  return true
}
