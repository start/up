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


context('Every syntax node class is exported:', () => {
  const SYNTAX_NODE_NAMES = [
    'AudioNode',
    'BlockquoteNode',
    'CodeBlockNode',
    'DescriptionListNode',
    'DocumentNode',
    'EmphasisNode',
    'FootnoteBlockNode',
    'FootnoteNode',
    'HeadingNode',
    'ImageNode',
    'InlineCodeNode',
    'InlineNsflNode',
    'InlineNsfwNode',
    'InlineSpoilerNode',
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
    'SectionSeparatorNode',
    'SpoilerBlockNode',
    'SquareBracketedNode',
    'StressNode',
    'UnorderedListNode',
    'VideoNode'
  ]

  for (const syntaxNodeName of SYNTAX_NODE_NAMES) {
    const syntaxNode = EXPORTS[syntaxNodeName]

    specify(syntaxNodeName, () => {
      expect(typeof (syntaxNode)).to.be.eql('function')
    })
  }
})