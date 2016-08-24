import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class SquareParenthetical extends ParentheticalSyntaxNode {
  write(writer: Renderer): string {
    return writer.squareParenthetical(this)
  }

  protected SQUARE_PARENTHETICAL(): void { }
}
