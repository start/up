import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { Config } from '../../Config'
import { HtmlWriter } from './HtmlWriter'

export function getHtml(document: DocumentNode, config: Config): string {
  return new HtmlWriter(document, config).result
}
