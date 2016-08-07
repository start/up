import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { UpConfig } from '../../UpConfig'
import { HtmlWriter } from './HtmlWriter'

export function getHtml(documentNode: DocumentNode, config: UpConfig): string {
  return new HtmlWriter(documentNode, config).result
}
