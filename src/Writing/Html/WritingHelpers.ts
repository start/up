import { escapeHtmlAttrValue, escapeHtmlContent } from './EscapingHelpers'


export function htmlElement(tagName: string, unescapedContent: string, attrs: any = {}): string {
  return htmlElementWithAlreadyEscapedChildren(
    tagName,
    [escapeHtmlContent(unescapedContent)],
    attrs)
}

export function htmlElementWithAlreadyEscapedChildren(tagName: string, escapedChildren: string[], attrs: any = {}): string {
  return (
    htmlStartTag(tagName, attrs)
    + escapedChildren.join('')
    + `</${tagName}>`)
}

export function singleTagHtmlElement(tagName: string, attrs: any = {}): string {
  return htmlStartTag(tagName, attrs)
}

export function classAttrValue(...names: string[]): string {
  // We always prefix our class names with 'up-' regardless of the provided ID prefix.
  return names
    .map(name => 'up-' + name)
    .join(' ')
}

export function internalFragmentUrl(id: string): string {
  return '#' + id
}

// Indicates that an attribute should not specify a value.
//
// In the following example, the `reversed` attribute doesn't specify a value:
//
// <ol reversed start="2">
//   <li value="2">
//     <p>Ivysaur</p>
//   </li>
//   <li value="1">
//     <p>Bulbasaur</p>
//   </li>
// </ol>
export const NO_ATTRIBUTE_VALUE: string = null


function htmlStartTag(tagName: string, attrs: any): string {
  const tagNameWithAttrs =
    [tagName, ...htmlAttrs(attrs)].join(' ')

  return `<${tagNameWithAttrs}>`
}

function htmlAttrs(attrs: any): string[] {
  const alphabetizedAttrNames =
    Object.keys(attrs).sort()

  return alphabetizedAttrNames.map(attrName => htmlAttr(attrs, attrName))
}

function htmlAttr(attrs: any, attrName: string): string {
  const value = attrs[attrName]

  return (
    value === NO_ATTRIBUTE_VALUE
      ? attrName
      : `${attrName}="${escapeHtmlAttrValue(value)}"`)
}
