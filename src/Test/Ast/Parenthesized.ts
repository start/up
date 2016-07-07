import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'


describe('Text surrounded by parentheses', () => {
  it('is put inside a parenthesized node with the parentheses preserved as plain text', () => {
    expect(Up.toAst('I like (certain types of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('(certain types of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Parenthesized text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like (certain *types* of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('(certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Nested parentheses (starting at the same time)', () => {
  it("produce nested parenthesized nodes with first opening parenthesis outside of the inner node", () => {
    expect(Up.toAst('I like ((certain) types of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new ParenthesizedNode([
            new PlainTextNode('(certain)')
          ]),
          new PlainTextNode(' types of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Nested parentheses (ending at the same time)', () => {
  it("produce nested parenthesized nodes with last closing parenthesis outside of the inner node", () => {
    expect(Up.toAst('I like (certain (types of)) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('(certain '),
          new ParenthesizedNode([
            new PlainTextNode('(types of)')
          ]),
          new PlainTextNode(')')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Two left parentheses followed by a single right square parenthesis', () => {
  it('produces parenthesized text starting from the second left parenthesis', () => {
    expect(Up.toAst(':( I like (certain *types* of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode(':( I like '),
        new ParenthesizedNode([
          new PlainTextNode('(certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('A left parenthesis followed by two right parentheses', () => {
  it('produces parenthesized text ending with the first right parenthesis', () => {
    expect(Up.toAst('I like (certain *types* of) pizza :)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('(certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of)')
        ]),
        new PlainTextNode(' pizza :)')
      ]))
  })
})


context('When there is a space after the opening parenthesis', () => {
  specify('it is treated as plain text', () => {
    expect(Up.toAst("I can't eat most pizza. 8o( But I can have some! 8o)")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I can't eat most pizza. 8o( But I can have some! 8o)")
      ]))
  })
})