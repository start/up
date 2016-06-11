export function htmlElement(tagName: string, content: string, attrs: any = {}): string {
  return htmlElementWithAlreadyEscapedChildren(tagName, [escapeHtmlContent(content)], attrs)
}

export function singleTagHtmlElement(tagName: string, attrs: any = {}): string {
  return htmlStartTag(tagName, attrs)
}

export function htmlElementWithAlreadyEscapedChildren(tagName: string, escapedChildren: string[], attrs: any = {}): string {
  return htmlStartTag(tagName, attrs) + escapedChildren.join('') + `</${tagName}>`
}

export function internalFragmentUrl(id: string): string {
  return '#' + id
}

export function cssClass(...names: string[]): string {
  // We always prefix our class names with 'up-' regardless of the provided document name.
  return names
    .map(name => 'up-' + name)
    .join(' ')
}

export function escapeHtmlContent(content: string): string {
  return htmlEscape(content, /[&<]/g)
}

function escapeHtmlAttrValue(attrValue: any): string {
  return htmlEscape(String(attrValue), /[&"]/g)
}

function htmlStartTag(tagName: string, attrs: any): string {
  const tagNameWithAttrs =
    [tagName].concat(htmlAttrs(attrs)).join(' ')

  return `<${tagNameWithAttrs}>`
}

function htmlAttrs(attrs: any): string[] {
  return Object.keys(attrs).map(attrName => htmlAttr(attrs, attrName))
}

function htmlAttr(attrs: any, attrName: string): string {
  const value = attrs[attrName]

  return (
    value == null
      ? attrName
      : `${attrName}="${escapeHtmlAttrValue(value)}"`)
}

const ESCAPED_HTML_ENTITIES_BY_CHAR: { [entity: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '"': '&quot;',
}

function htmlEscape(html: string, charsToEscape: RegExp): string {
  return html.replace(charsToEscape, char => ESCAPED_HTML_ENTITIES_BY_CHAR[char])
}