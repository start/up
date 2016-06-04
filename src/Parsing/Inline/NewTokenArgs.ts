import { Token } from './Token'
import { TokenKind } from './TokenKind'

export interface NewTokenArgs {
  kind: TokenKind
  value?: string,
  correspondsToToken?: Token
}