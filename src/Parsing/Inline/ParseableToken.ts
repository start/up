import { TokenMeaning } from './TokenMeaning'


export interface ParseableToken {
  meaning: TokenMeaning
  value?: string
}
