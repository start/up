import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Tokenizer } from './Tokenization/Tokenizer'
import { parse} from './parse'
import { UpConfig } from '../../UpConfig'


export function getInlineNodes(text: string, config: UpConfig): InlineSyntaxNode[] {
  const { tokens } = new Tokenizer(text, config)

  return parse(tokens)
}
