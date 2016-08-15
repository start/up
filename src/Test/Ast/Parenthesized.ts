import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParentheticalNode } from '../../SyntaxNodes/ParentheticalNode'


describe('Text surrounded by parentheses', () => {
  it('is put inside a parenthetical node with the parentheses preserved as plain text', () => {
    expect(Up.toDocument('I like (certain types of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParentheticalNode([
          new PlainTextNode('(certain types of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Parenthesized text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('I like (certain *types* of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParentheticalNode([
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
  it("produce nested parenthetical nodes with first opening parenthesis outside of the inner node", () => {
    expect(Up.toDocument('I like ((certain) types of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParentheticalNode([
          new PlainTextNode('('),
          new ParentheticalNode([
            new PlainTextNode('(certain)')
          ]),
          new PlainTextNode(' types of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Nested parentheses (ending at the same time)', () => {
  it("produce nested parenthetical nodes with last closing parenthesis outside of the inner node", () => {
    expect(Up.toDocument('I like (certain (types of)) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParentheticalNode([
          new PlainTextNode('(certain '),
          new ParentheticalNode([
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
    expect(Up.toDocument(':( I like (certain *types* of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode(':( I like '),
        new ParentheticalNode([
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
    expect(Up.toDocument('I like (certain *types* of) pizza :)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParentheticalNode([
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


describe('An opening parentheses followed by whitespace', () => {
  it('does not open a parenthesized convention', () => {
    expect(Up.toDocument("I can't eat most pizza. 8o( But I can have some! 8o)")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I can't eat most pizza. 8o( But I can have some! 8o)")
      ]))
  })
})
