import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


describe('Text surrounded by parentheses', () => {
  it('is put inside a normal parenthetical node with the parentheses preserved as plain text', () => {
    expect(Up.toDocument('I like (certain types of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new NormalParenthetical([
          new PlainText('(certain types of)')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Parenthesized text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('I like (certain *types* of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new NormalParenthetical([
          new PlainText('(certain '),
          new Emphasis([
            new PlainText('types')
          ]),
          new PlainText(' of)')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Nested parentheses (starting at the same time)', () => {
  it("produce nested normal parenthetical nodes with first opening parenthesis outside of the inner node", () => {
    expect(Up.toDocument('I like ((certain) types of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new NormalParenthetical([
          new PlainText('('),
          new NormalParenthetical([
            new PlainText('(certain)')
          ]),
          new PlainText(' types of)')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Nested parentheses (ending at the same time)', () => {
  it("produce nested normal parenthetical nodes with last closing parenthesis outside of the inner node", () => {
    expect(Up.toDocument('I like (certain (types of)) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new NormalParenthetical([
          new PlainText('(certain '),
          new NormalParenthetical([
            new PlainText('(types of)')
          ]),
          new PlainText(')')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Two left parentheses followed by a single right square parenthesis', () => {
  it('produces parenthesized text starting from the second left parenthesis', () => {
    expect(Up.toDocument(':( I like (certain *types* of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText(':( I like '),
        new NormalParenthetical([
          new PlainText('(certain '),
          new Emphasis([
            new PlainText('types')
          ]),
          new PlainText(' of)')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('A left parenthesis followed by two right parentheses', () => {
  it('produces parenthesized text ending with the first right parenthesis', () => {
    expect(Up.toDocument('I like (certain *types* of) pizza :)')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new NormalParenthetical([
          new PlainText('(certain '),
          new Emphasis([
            new PlainText('types')
          ]),
          new PlainText(' of)')
        ]),
        new PlainText(' pizza :)')
      ]))
  })
})


describe('An opening parentheses followed by whitespace', () => {
  it('does not open a parenthesized convention', () => {
    expect(Up.toDocument("I can't eat most pizza. 8o( But I can have some! 8o)")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I can't eat most pizza. 8o( But I can have some! 8o)")
      ]))
  })
})
