"use strict";

const EXPORTED_SYNTAX_NODE_CLASS_NAMES = [
  'Document',
  'InlineDocument',
  'Audio',
  'Bold',
  'Blockquote',
  'CodeBlock',
  'DescriptionList',
  'Emphasis',
  'ExampleInput',
  'FootnoteBlock',
  'Footnote',
  'Heading',
  'Highlight',
  'Image',
  'InlineCode',
  'InlineNsfl',
  'InlineNsfw',
  'InlineSpoiler',
  'InlineQuote',
  'Italic',
  'LineBlock',
  'Link',
  'NsflBlock',
  'NsfwBlock',
  'OrderedList',
  'Paragraph',
  'NormalParenthetical',
  'PlainText',
  'SectionLink',
  'SpoilerBlock',
  'SquareParenthetical',
  'Stress',
  'Table',
  'ThematicBreak',
  'UnorderedList',
  'Video',
  'InlineSyntaxNodeContainer',
  'MediaSyntaxNode',
  'OutlineSyntaxNodeContainer',
  'RevealableInlineSyntaxNode',
  'RevealableOutlineSyntaxNode',
  'RichInlineSyntaxNode',
  'RichOutlineSyntaxNode',
]

module.exports = require('./Up').Up

for (const className of EXPORTED_SYNTAX_NODE_CLASS_NAMES) {
  module.exports[className] = require('./SyntaxNodes/' + className)[className]
}
