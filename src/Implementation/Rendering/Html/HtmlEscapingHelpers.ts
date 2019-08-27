export function escapeHtmlContent(content: string): string {
  return escapeHtml(content, /[&<]/g)
}

export function escapeHtmlAttrValue(attrValue: string | number): string {
  return escapeHtml(String(attrValue), /[&"]/g)
}

function escapeHtml(html: string, charsToEscape: RegExp): string {
  return html.replace(
    charsToEscape,
    char => ESCAPED_HTML_ENTITIES_BY_CHAR[char])
}

const ESCAPED_HTML_ENTITIES_BY_CHAR: { [char: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '"': '&quot;'
}
