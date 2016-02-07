import { SyntaxNode } from './SyntaxNode'

export class SectionSeparatorNode extends SyntaxNode {
  text(): string {
    return ''
  }
  
  private SECTION_SEPARATOR: any = null
}