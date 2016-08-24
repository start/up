import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { InlineUpDocument } from '../../SyntaxNodes/InlineUpDocument'
import { Config } from '../../Config'
import { HtmlRenderer } from './HtmlRenderer'


export function getHtml(document: UpDocument, config: Config): string {
  return new HtmlRenderer(document, config).result
}

export function getInlineHtml(document: InlineUpDocument, config: Config): string {
  return new HtmlRenderer(document, config).result
}
