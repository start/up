import { TokenRole } from './TokenRole'
import { RevealableInlineSyntaxNodeType } from '../../SyntaxNodes/RevealableInlineSyntaxNodeType'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


export class RevealableConvention implements RichConventionWithoutExtraFields {
  SyntaxNodeType: RevealableInlineSyntaxNodeType
  startTokenRole: TokenRole
  endTokenRole: TokenRole

  constructor(
    args: {
      SyntaxNodeType: RevealableInlineSyntaxNodeType
      startTokenRole: TokenRole
      endTokenRole: TokenRole
    }
  ) {
    this.SyntaxNodeType = args.SyntaxNodeType
    this.startTokenRole = args.startTokenRole
    this.endTokenRole = args.endTokenRole
  }
}
