import { RichConvention } from '../RichConvention'
import { Token } from '../Tokens/Token'


export function getConventionEndedBy(token: Token, conventions: RichConvention[]): RichConvention {
  return conventions.filter(convention =>
    token instanceof convention.EndTokenType
  )[0]
}
