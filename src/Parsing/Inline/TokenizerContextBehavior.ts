import { TokenizerState } from './TokenizerState'
import { OnTokenizerMatch } from './OnTokenizerMatch'


export interface TokenizerContextBehavior {
  mustClose: boolean
  onOpen?: OnTokenizerMatch
  onResolve?: OnTokenizerMatch
  onClose?: OnTokenizerMatch
}
