import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'

export type SyntaxNode = DocumentNode|OutlineSyntaxNode|InlineSyntaxNode