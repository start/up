import { TokenType } from './TokenType'
import { TokenizerGoal } from './TokenizerGoal'


export class MediaConvention {
  constructor(
    public nonLocalizedTerm: string,
    public StartTokenType: TokenType,
    public goal: TokenizerGoal) { }
}
