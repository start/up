import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { Tokenizer } from './Tokenizer'
import { Parser} from './Parser'
import { UpConfig } from '../../UpConfig'


export function getInlineNodes(text: string, config: UpConfig): InlineSyntaxNode[] {
  const { tokens } = new Tokenizer(text, config)

  return new Parser({ tokens }).result.nodes
}
