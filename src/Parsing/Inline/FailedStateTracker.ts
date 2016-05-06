import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TokenizerResult } from './TokenizerResult'
import { TokenizerState } from './TokenizerState'
import { OldTokenizerContext, TokenizerContext } from './TokenizerContext'
import { RichConvention } from './RichConvention'
import { last, lastChar, swap } from '../CollectionHelpers'
import { escapeForRegex } from '../TextHelpers'
import { applyRaisedVoicesToRawTokens }  from './RaisedVoices/ApplyRaisedVoicesToRawTokens'
import { AUDIO, IMAGE, VIDEO } from './MediaConventions'
import { massageTokensIntoTreeStructure } from './MassageTokensIntoTreeStructure'
import { UpConfig } from '../../UpConfig'
import { VideoToken } from './Tokens/VideoToken'
import { Token, TokenType } from './Tokens/Token'
import { PotentialRaisedVoiceTokenType } from './Tokens/PotentialRaisedVoiceToken'
import { startsWith, ANY_WHITESPACE, NON_WHITESPACE_CHAR } from '../Patterns'

export class FailedStateTracker {
  private failedStatesByTextIndex: FailedStatesByTextIndex
  
  registerFailure(failedContext: TokenizerContext): void {
    const { textIndex, state } = failedContext
    
    if (!this.failedStatesByTextIndex[textIndex]) {
      this.failedStatesByTextIndex[textIndex] = []
    }
    
    this.failedStatesByTextIndex[textIndex].push(state)
  }
  
  hasFailed(state: TokenizerState, textIndex: number): boolean {
    const failedStates = (this.failedStatesByTextIndex[textIndex] || [])
    return failedStates.some(failedState => failedState === state)
  }
}

interface FailedStatesByTextIndex {
  [textIndex: number]: TokenizerState[]
}