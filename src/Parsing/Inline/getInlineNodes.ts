import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize } from './Tokenization/tokenize'
import { parse} from './parse'
import { UpConfig } from '../../UpConfig'


export function getInlineNodes(markup: string, config: UpConfig): InlineSyntaxNode[] {
  return parse(tokenize(markup, config))
}
