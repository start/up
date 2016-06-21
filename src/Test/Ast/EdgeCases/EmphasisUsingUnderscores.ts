import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'


describe('An unmatched underscore', () => {
  it('does not create an emphasis node', () => {
    expect(Up.toAst('Hello, _world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, _world!')
      ]))
  })

  it('does not create an emphasis node, even when following 2 matching underscores', () => {
    expect(Up.toAst('_Hello_, _world!')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Hello'),
        ]),
        new PlainTextNode(', _world!')
      ]))
  })
})


describe('Matching single underscores each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.toAst('I believe _ will win the primary in _ easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe _ will win the primary in _ easily.')
      ])
    )
  })
})


describe('An underscore followed by whitespace with a matching underscore touching the end of a word', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.toAst('I believe_ my spelling_ was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe_ my spelling_ was wrong.')
      ])
    )
  })
})


describe('An underscore touching the beginning of a word with a matching underscore preceded by whitespace', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.toAst('I _believe my _spelling was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I _believe my _spelling was wrong.')
      ])
    )
  })
})
