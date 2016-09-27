import { TokenRole } from './TokenRole'
import { InlineRevealableContentType } from '../../SyntaxNodes/InlineRevealableContentType'
import { RichConventionWithoutExtraFields } from './RichConventionWithoutExtraFields'


export class RevealableConvention implements RichConventionWithoutExtraFields {
  SyntaxNodeType: InlineRevealableContentType
  startTokenRole: TokenRole
  endTokenRole: TokenRole

  constructor(
    args: {
      SyntaxNodeType: InlineRevealableContentType
      startTokenRole: TokenRole
      endTokenRole: TokenRole
    }
  ) {
    this.SyntaxNodeType = args.SyntaxNodeType
    this.startTokenRole = args.startTokenRole
    this.endTokenRole = args.endTokenRole
  }
}
