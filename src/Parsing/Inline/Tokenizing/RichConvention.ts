import { TokenKind } from './TokenKind'


// In the context of tokenization, a rich inline convention is one that can contain
// other inline conventions between its start and end tokens.
export interface RichConvention {
   startTokenKind: TokenKind
   endTokenKind: TokenKind
}
