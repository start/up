import { TokenizerContext } from './TokenizerContext'

export interface ResolveUnclosedConvention {
  (context: TokenizerContext): boolean
}