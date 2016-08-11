import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { tokenize } from './Tokenization/tokenize'
import { parse} from './parse'
import { Config } from '../../Config'


export function getInlineNodes(markup: string, config: Config): InlineSyntaxNode[] {
  return parse(tokenize(markup, config))
}
