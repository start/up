import { Renderer } from '../Rendering/Renderer'
import { InlineSyntaxNode } from './InlineSyntaxNode'


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
