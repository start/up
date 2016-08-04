import { TokenKind } from './Tokenization/TokenKind'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RevealableInlineSyntaxNode } from '../../SyntaxNodes/RevealableInlineSyntaxNode'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


// A "revealable" inline convention is one that requires deliberate action from the reader to reveal.
//
// Spoilers are an example.
export class RevealableConvention implements RichConventionWithoutExtraFields {
  NodeType: RevealableInlineSyntaxNodeType
  startTokenKind: TokenKind
  endTokenKind: TokenKind

  constructor(
    args: {
      NodeType: RevealableInlineSyntaxNodeType
      startTokenKind: TokenKind
      endTokenKind: TokenKind
    }
  ) {
    this.NodeType = args.NodeType
    this.startTokenKind = args.startTokenKind
    this.endTokenKind = args.endTokenKind
  }
}


export interface RevealableInlineSyntaxNodeType {
  new (children: InlineSyntaxNode[]): RevealableInlineSyntaxNode
}
