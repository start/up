import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'


export type SyntaxNode =
  DocumentNode | OutlineSyntaxNode | InlineSyntaxNode
