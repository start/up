import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export interface SyntaxNode {
  inlineDescendants(): InlineSyntaxNode[]
  write(writer: Renderer): string
}
