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

const ESCAPED_HTML_ENTITIES_BY_ENTITY: { [entity: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
}

export function escapeHtmlContent(content: string): string {
  return content.replace(/[&<]/g, entity => ESCAPED_HTML_ENTITIES_BY_ENTITY[entity]) 
}


function htmlStartTag(tagName: string, attrs: any): string {
  const tagNameWithAttrs =
    [tagName].concat(htmlAttrs(attrs)).join(' ')

  return `<${tagNameWithAttrs}>`
}

function htmlAttrs(attrs: any): string[] {
  return (
    Object.keys(attrs)
      .map(key => {
        const value = attrs[key]
        return (value == null ? key : `${key}="${value}"`)
      })
  )
}