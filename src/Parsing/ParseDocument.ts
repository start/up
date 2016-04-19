import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { MediaSyntaxNode } from '../SyntaxNodes/MediaSyntaxNode'
import { TextConsumer } from './TextConsumer'
import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'

export function parseDocument(text: string): DocumentNode {
  const outlineNodes = getOutlineNodes(text)
  
  return new DocumentNode(outlineNodes)
}