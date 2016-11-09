import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Its HTML equivalent is the `<kbd>` element.
export class ExampleUserInput implements InlineSyntaxNode {
  constructor(public userInput: string) { }

  textAppearingInline(): string {
    return this.userInput
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.exampleUserInput(this)
  }
}
