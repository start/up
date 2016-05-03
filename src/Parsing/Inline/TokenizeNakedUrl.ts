import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Convention } from './Convention'
import { SandwichConvention } from './SandwichConvention'
import { TextConsumer } from './TextConsumer'
import { last, lastChar, swap } from '../CollectionHelpers'
import { applyBackslashEscaping } from '../TextHelpers'
import { applyRaisedVoicesToRawTokens }  from './RaisedVoices/ApplyRaisedVoicesToRawTokens'
import { getMediaTokenizer }  from './GetMediaTokenizer'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, FOOTNOTE } from './SandwichConventions'
import { massageTokensIntoTreeStructure } from './MassageTokensIntoTreeStructure'
import { UpConfig } from '../../UpConfig'
import { AudioToken } from './Tokens/AudioToken'
import { EmphasisEndToken } from './Tokens/EmphasisEndToken'
import { EmphasisStartToken } from './Tokens/EmphasisStartToken'
import { ImageToken } from './Tokens/ImageToken'
import { InlineCodeToken } from './Tokens/InlineCodeToken'
import { LinkStartToken } from './Tokens/LinkStartToken'
import { LinkEndToken } from './Tokens/LinkEndToken'
import { PlainTextToken } from './Tokens/PlainTextToken'
import { PotentialRaisedVoiceEndToken } from './Tokens/PotentialRaisedVoiceEndToken'
import { PotentialRaisedVoiceStartOrEndToken } from './Tokens/PotentialRaisedVoiceStartOrEndToken'
import { PotentialRaisedVoiceStartToken } from './Tokens/PotentialRaisedVoiceStartToken'
import { SpoilerEndToken } from './Tokens/SpoilerEndToken'
import { SpoilerStartToken } from './Tokens/SpoilerStartToken'
import { StressEndToken } from './Tokens/StressEndToken'
import { StressStartToken } from './Tokens/StressStartToken'
import { RevisionInsertionStartToken } from './Tokens/RevisionInsertionStartToken'
import { RevisionInsertionEndToken } from './Tokens/RevisionInsertionEndToken'
import { RevisionDeletionStartToken } from './Tokens/RevisionDeletionStartToken'
import { RevisionDeletionEndToken } from './Tokens/RevisionDeletionEndToken'
import { VideoToken } from './Tokens/VideoToken'
import { Token, TokenType } from './Tokens/Token'
import { PotentialRaisedVoiceTokenType } from './Tokens/PotentialRaisedVoiceToken'


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
