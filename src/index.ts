import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { getOutlineNodes } from './Parsing/Outline/GetOutlineNodes'
import { HtmlWriter } from './Writer/HtmlWriter'

export function ast(text: string): DocumentNode {
  return new DocumentNode(getOutlineNodes(text))
}

const htmlWriter = new HtmlWriter()

export function html(text: string): string {
  return htmlWriter.document(ast(text))
}

export function htmlFromSyntaxNode(node: SyntaxNode): string {
  return htmlWriter.write(node)
}
