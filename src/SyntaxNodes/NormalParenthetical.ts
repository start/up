import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class NormalParenthetical extends ParentheticalSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.normalParenthetical(this)
  }

  protected NORMAL_PARENTHETICAL(): void { }
}
