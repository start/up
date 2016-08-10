import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { UpConfig } from '../../UpConfig'
import { HtmlWriter } from './HtmlWriter'

export function getHtml(document: DocumentNode, config: UpConfig): string {
  return new HtmlWriter(document, config).result
}
