import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { getOutlineNodes } from './Parsing/Outline/GetOutlineNodes'
import { HtmlWriter } from './Writer/HtmlWriter'
import { Up } from './Up'

const up = new Up()

export function toAst(text: string): DocumentNode {
  return up.toAst(text)
}

export function toHtml(textOrNode: string | SyntaxNode): string {
  return up.toHtml(textOrNode)
}
