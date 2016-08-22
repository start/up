import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'
import { Writer } from '../Writing/Writer'


export class SquareParenthetical extends ParentheticalSyntaxNode {
  write(writer: Writer): string {
    return writer.squareParenthetical(this)
  }

  protected SQUARE_PARENTHETICAL(): void { }
}
