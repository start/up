import { TokenRole } from './TokenRole'


export interface ParseableToken {
  role: TokenRole
  value?: string
}
