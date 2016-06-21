import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize } from './Tokenization/tokenize'
import { parse} from './parse'
import { UpConfig } from '../../UpConfig'


export function getInlineNodes(text: string, config: UpConfig): InlineSyntaxNode[] {
  return parse(tokenize(text, config))
}
