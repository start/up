"use strict";

const expect = require('chai').expect
const Up = require('./dist/index')


context("The Up library's methods can be invoked two ways:", () => {
  specify('By treating the module as a namespace', () => {
    expect(Up.parseAndRender('It actually worked?')).to.equal('<p>It actually worked?</p>')
  })

  specify('By treating the module as a class', () => {
    expect(new Up().parseAndRender('That seems *very* unlikely.')).to.equal('<p>That seems <em>very</em> unlikely.</p>')
  })
})


context('Several classes are available as members of the Up library:', () => {
  context('Both document classes', () => {
    specifyEachClassShouldBeExported([
      'Document',
      'InlineDocument'
    ])
  })

  context('Every syntax node class', () => {
    specifyEachClassShouldBeExported([
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
      'Video'
    ])
  })

  context('Every base syntax node class', () => {
    specifyEachClassShouldBeExported([
      'InlineSyntaxNodeContainer',
      'MediaSyntaxNode',
      'OutlineSyntaxNodeContainer',
      'RevealableInlineSyntaxNode',
      'RevealableOutlineSyntaxNode',
      'RichInlineSyntaxNode',
      'RichOutlineSyntaxNode'
    ])
  })
})


function specifyEachClassShouldBeExported(classNames) {
  for (const className of classNames) {
    specify(className, () => {
      expect(typeof Up[className]).to.equal('function')
    })
  }
}
