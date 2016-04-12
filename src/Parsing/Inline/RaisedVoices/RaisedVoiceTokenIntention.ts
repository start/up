import { InlineSyntaxNode } from '../../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Convention } from '../Convention'
import { Sandwich } from '../Sandwich'
import { TextConsumer } from '../../TextConsumer'
import { last, lastChar, swap } from '../../CollectionHelpers'
import { Token, TokenMeaning } from '.././Token'
import { FailureTracker } from '../FailureTracker'
import { applyBackslashEscaping } from '../../TextHelpers'
import { STRESS, EMPHASIS, REVISION_DELETION, REVISION_INSERTION, SPOILER, INLINE_ASIDE } from '../Sandwiches'

export abstract class RaisedVoiceTokenIntention {
  constructor(public originalTokenIndex: number, protected originalValue: string) { }

  abstract tokens(): Token[]
}

export function compareIntentionsDecending(a: RaisedVoiceTokenIntention, b: RaisedVoiceTokenIntention): number {
  return b.originalTokenIndex - a.originalTokenIndex
}