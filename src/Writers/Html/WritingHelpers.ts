import { escapeHtmlAttrValue, escapeHtmlContent } from './EscapingHelpers'


export function htmlElement(
  tagName: string,
  content: string,
  attrs: any = {}
): string {
  return htmlElementWithAlreadyEscapedChildren(tagName, [escapeHtmlContent(content)], attrs)
}

export function htmlElementWithAlreadyEscapedChildren(
  tagName: string,
  escapedChildren: string[],
  attrs: any = {}
): string {
  return htmlStartTag(tagName, attrs) + escapedChildren.join('') + `</${tagName}>`
}

export function singleTagHtmlElement(tagName: string, attrs: any = {}): string {
  return htmlStartTag(tagName, attrs)
}

export function classAttrValue(...names: string[]): string {
  // We always prefix our class names with 'up-' regardless of the provided document name.
  return names
    .map(name => 'up-' + name)
    .join(' ')
}

export function internalFragmentUrl(id: string): string {
  return '#' + id
}

// Indicates that an attribute should not have any value.
export const EMPTY_ATTRIBUTE: string = null 


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
    value == EMPTY_ATTRIBUTE
      ? attrName
      : `${attrName}="${escapeHtmlAttrValue(value)}"`)
}