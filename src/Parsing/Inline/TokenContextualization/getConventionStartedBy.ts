import { RichConvention } from '../RichConvention'
import { Token } from '../Tokens/Token'


export function getConventionStartedBy(token: Token, conventions: RichConvention[]): RichConvention {
  return conventions.filter(convention =>
    token instanceof convention.StartTokenType
  )[0]
}