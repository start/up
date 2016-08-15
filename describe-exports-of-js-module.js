"use strict";

const expect = require('chai').expect
const EXPORTS = require('./dist/index')


context('The Up library is exported two ways.', () => {
  specify('As default', () => {
    const Up = EXPORTS.default
    expect(Up.toHtml('It actually worked?')).to.be.eql('<p>It actually worked?</p>')
  })

  specify('As Up', () => {
    const Up = EXPORTS.Up
    expect(Up.toHtml('That seems *very* unlikely.')).to.be.eql('<p>That seems <em>very</em> unlikely.</p>')
  })

  specify('Both exports point to the same object', () => {
    expect(EXPORTS.default).to.be.eql(EXPORTS.Up)
  })
})


context('Both document classes are exported:', () => {
  specifyEveryClassShouldBeExported([
    'UpDocument',
    'InlineUpDocument'
  ])
})


context('Every syntax node class is exported:', () => {
  specifyEveryClassShouldBeExported([
    'AudioNode',
    'BoldNode',
    'BlockquoteNode',
    'CodeBlockNode',
    'DescriptionListNode',
    'EmphasisNode',
    'ExampleInputNode',
    'FootnoteBlockNode',
    'FootnoteNode',
    'HeadingNode',
    'HighlightNode',
    'ImageNode',
    'InlineCodeNode',
    'InlineNsflNode',
    'InlineNsfwNode',
    'InlineSpoilerNode',
    'ItalicNode',
    'LineBlockNode',
    'LinkNode',
    'NsflBlockNode',
    'NsfwBlockNode',
    'OrderedListNode',
    'ParagraphNode',
    'ParenthesizedNode',
    'PlainTextNode',
    'RevisionDeletionNode',
    'RevisionInsertionNode',
    'OutlineSeparatorNode',
    'SpoilerBlockNode',
    'SquareBracketedNode',
    'StressNode',
    'TableNode',
    'UnorderedListNode',
    'VideoNode'
  ])
})

context('Every base syntax node class is exported:', () => {
  specifyEveryClassShouldBeExported([
    'InlineSyntaxNodeContainer',
    'MediaSyntaxNode',
    'OutlineSyntaxNodeContainer',
    'RevealableInlineSyntaxNode',
    'RevealableOutlineSyntaxNode',
    'RichInlineSyntaxNode',
    'RichOutlineSyntaxNode'
  ])
})


context('For anyone who really wants to fiddle with the abstract syntax tree', () => {
  specify('the exported `createUpDocument` function helps create documents with proper footnote blocks and tables of contents', () => {
    expectAClassOrFunction(EXPORTS['createUpDocument'])
  })
})


function specifyEveryClassShouldBeExported(classNames) {
  for (const className of classNames) {
    specify(className, () => {
      expectAClassOrFunction(EXPORTS[className])
    })
  }
}

function expectAClassOrFunction(object) {
  expect(typeof object).to.be.eql('function')
}
