import { DocumentNode } from './DocumentNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export type SyntaxNode =
  DocumentNode | OutlineSyntaxNode | InlineSyntaxNode
