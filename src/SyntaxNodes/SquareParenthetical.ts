import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class SquareParenthetical extends ParentheticalSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.squareParenthetical(this)
  }

  protected SQUARE_PARENTHETICAL(): void { }
}
