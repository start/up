import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Config } from '../../Config'
import { HtmlWriter } from './HtmlWriter'

export function getHtml(document: UpDocument, config: Config): string {
  return new HtmlWriter(document, config).result
}
