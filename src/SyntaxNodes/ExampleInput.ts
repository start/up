import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Its HTML equivalent is the `<kbd>` element.
export class ExampleInput implements InlineSyntaxNode {
  constructor(public input: string) { }

  textAppearingInline(): string {
    return this.input
  }

  searchableText(): string {
    return this.input
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.exampleInput(this)
  }
}
