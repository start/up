import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { getOutlineNodes } from './Parsing/Outline/GetOutlineNodes'
import { HtmlWriter } from './Writer/HtmlWriter'

export function toAst(text: string): DocumentNode {
  return new DocumentNode(getOutlineNodes(text))
}

const htmlWriter = new HtmlWriter()

export function toHtml(textOrNode: string | SyntaxNode): string {
  const node = (
    typeof textOrNode === 'string'
      ? toAst(textOrNode)
      : textOrNode
  )

  return htmlWriter.write(node)
}
