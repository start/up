import { escapeHtmlAttrValue, escapeHtmlContent } from './HtmlEscapingHelpers'


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

// When an attribute value is `null`, `undefined`, or an empty string, its value
// isn't rendered.
//
// For example, the `reversed` attribute of ordered lists doesn't render a value:
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
// The purpose of this constant is to make that behavior a bit clearer. 
export const EMPTY_ATTRBUTE_VALUE: string = ''


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

  return (value === '') || (value == null)
    ? attrName
    : `${attrName}="${escapeHtmlAttrValue(value)}"`
}
