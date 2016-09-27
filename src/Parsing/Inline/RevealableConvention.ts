import { TokenRole } from './TokenRole'
import { InlineRevealableType } from '../../SyntaxNodes/InlineRevealableType'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


export class RevealableConvention implements RichConventionWithoutExtraFields {
  SyntaxNodeType: InlineRevealableType
  startTokenRole: TokenRole
  endTokenRole: TokenRole

  constructor(
    args: {
      SyntaxNodeType: InlineRevealableType
      startTokenRole: TokenRole
      endTokenRole: TokenRole
    }
  ) {
    this.SyntaxNodeType = args.SyntaxNodeType
    this.startTokenRole = args.startTokenRole
    this.endTokenRole = args.endTokenRole
  }
}
