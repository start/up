export function escapeHtmlContent(content: string): string {
  return htmlEscape(content, /[&<]/g)
}

export function escapeHtmlAttrValue(attrValue: any): string {
  return htmlEscape(String(attrValue), /[&"]/g)
}

function htmlEscape(html: string, charsToEscape: RegExp): string {
  return html.replace(charsToEscape, char => ESCAPED_HTML_ENTITIES_BY_CHAR[char])
}

const ESCAPED_HTML_ENTITIES_BY_CHAR: { [entity: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '"': '&quot;'
}
