import { escapeHtmlAttrValue, escapeHtmlContent } from './HtmlEscapingHelpers'


export function htmlElement(tagName: string, unescapedContent: string, attrs: Attrs = {}): string {
  return htmlElementWithAlreadyEscapedChildren(
    tagName,
    [escapeHtmlContent(unescapedContent)],
    attrs)
}

export function htmlElementWithAlreadyEscapedChildren(tagName: string, escapedChildren: string[], attrs: Attrs = {}): string {
  return (
    htmlStartTag(tagName, attrs)
    + escapedChildren.join('')
    + `</${tagName}>`)
}

export function singleTagHtmlElement(tagName: string, attrs: Attrs = {}): string {
  return htmlStartTag(tagName, attrs)
}

// If an attribute's value is `undefined`, we render only its name without any value.
//
// For example, we don't render a value for the `reversed` attribute of numbered lists:
//
//   <ol reversed start="2">
//     <li value="2">
//       <p>Ivysaur</p>
//     </li>
//     <li value="1">
//       <p>Bulbasaur</p>
//     </li>
//   </ol>
//
// The purpose of this constant is to make that behavior a bit more explicit.
export const EMPTY_ATTRIBUTE_VALUE = undefined

export type Attrs = {
  [name: string]: string | number | typeof EMPTY_ATTRIBUTE_VALUE
}


function htmlStartTag(tagName: string, attrs: Attrs): string {
  const tagNameWithAttrs =
    [tagName, ...htmlAttrs(attrs)].join(' ')

  return `<${tagNameWithAttrs}>`
}

function htmlAttrs(attrs: Attrs): string[] {
  const alphabetizedAttrNames =
    Object.keys(attrs).sort()

  return alphabetizedAttrNames.map(attrName => htmlAttr(attrs, attrName))
}

function htmlAttr(attrs: Attrs, attrName: string): string {
  const value = attrs[attrName]

  return (value === EMPTY_ATTRIBUTE_VALUE)
    ? attrName
    : `${attrName}="${escapeHtmlAttrValue(value)}"`
}
