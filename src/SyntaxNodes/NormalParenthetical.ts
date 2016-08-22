import { ParentheticalSyntaxNode } from './ParentheticalSyntaxNode'
import { Writer } from '../Writing/Writer'


export class NormalParenthetical extends ParentheticalSyntaxNode {
  write(writer: Writer): string {
    return writer.normalParenthetical(this)
  }

  protected NORMAL_PARENTHETICAL(): void { }
}
