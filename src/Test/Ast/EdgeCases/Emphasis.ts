import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'


describe('An unmatched asterisk', () => {
  it('does not create an emphasis node', () => {
    expect(Up.toAst('Hello, *world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, *world!')
      ]))
  })

  it('does not create an emphasis node, even when following 2 matching asterisks', () => {
    expect(Up.toAst('*Hello*, *world!')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Hello'),
        ]),
        new PlainTextNode(', *world!')
      ]))
  })
})


describe('Matching single asterisks each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.toAst('I believe * will win the primary in * easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe * will win the primary in * easily.')
      ])
    )
  })
})


describe('An asterisk followed by whitespace with a matching asterisk touching the end of a word', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.toAst('I believe* my spelling* was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe* my spelling* was wrong.')
      ])
    )
  })
})


describe('An asterisk touching the beginning of a word with a matching asterisk preceded by whitespace', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.toAst('I *believe my *spelling was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I *believe my *spelling was wrong.')
      ])
    )
  })
})


describe('Emphasized text containing an unmatched openining delimiter requiring backtracking', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toAst('Hello, *my ++world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my ++world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping emphasized text (containing an unmatched openining delimiter requiring backtracking)', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toAst('++Hello, *my++ ~~world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('Hello, '),
          new EmphasisNode([
            new PlainTextNode('my')
          ]),
        ]),
        new EmphasisNode([
          new PlainTextNode(' ~~world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})