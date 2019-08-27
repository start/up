import { Renderer } from '../Rendering/Renderer'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export interface SyntaxNode {
  inlineDescendants(): InlineSyntaxNode[]
  render(renderer: Renderer): string
}
