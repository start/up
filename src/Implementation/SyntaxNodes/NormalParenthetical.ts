import { Renderer } from '../Rendering/Renderer'
import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'


export class NormalParenthetical extends ParentheticalSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.normalParenthetical(this)
  }

  protected readonly NORMAL_PARENTHETICAL = undefined
}
