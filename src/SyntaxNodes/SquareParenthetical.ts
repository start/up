import { Renderer } from '../Rendering/Renderer'
import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'


export class SquareParenthetical extends ParentheticalSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.squareParenthetical(this)
  }

  protected SQUARE_PARENTHETICAL(): void { }
}
