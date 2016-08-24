import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class NormalParenthetical extends ParentheticalSyntaxNode {
  write(writer: Renderer): string {
    return writer.normalParenthetical(this)
  }

  protected NORMAL_PARENTHETICAL(): void { }
}
