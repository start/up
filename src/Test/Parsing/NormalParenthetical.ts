import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by parentheses', () => {
  it('is put inside a normal parenthetical node with the parentheses preserved as plain text', () => {
    expect(Up.parse('I like (certain types of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.NormalParenthetical([
          new Up.PlainText('(certain types of)')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Parenthesized text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.parse('I like (certain *types* of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.NormalParenthetical([
          new Up.PlainText('(certain '),
          new Up.Emphasis([
            new Up.PlainText('types')
          ]),
          new Up.PlainText(' of)')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Nested parentheses (starting at the same time)', () => {
  it("produce nested normal parenthetical nodes with first opening parenthesis outside of the inner node", () => {
    expect(Up.parse('I like ((certain) types of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.NormalParenthetical([
            new Up.PlainText('(certain)')
          ]),
          new Up.PlainText(' types of)')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Nested parentheses (ending at the same time)', () => {
  it("produce nested normal parenthetical nodes with last closing parenthesis outside of the inner node", () => {
    expect(Up.parse('I like (certain (types of)) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.NormalParenthetical([
          new Up.PlainText('(certain '),
          new Up.NormalParenthetical([
            new Up.PlainText('(types of)')
          ]),
          new Up.PlainText(')')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Two left parentheses followed by a single right square parenthesis', () => {
  it('produces parenthesized text starting from the second left parenthesis', () => {
    expect(Up.parse(':( I like (certain *types* of) pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText(':( I like '),
        new Up.NormalParenthetical([
          new Up.PlainText('(certain '),
          new Up.Emphasis([
            new Up.PlainText('types')
          ]),
          new Up.PlainText(' of)')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('A left parenthesis followed by two right parentheses', () => {
  it('produces parenthesized text ending with the first right parenthesis', () => {
    expect(Up.parse('I like (certain *types* of) pizza :)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.NormalParenthetical([
          new Up.PlainText('(certain '),
          new Up.Emphasis([
            new Up.PlainText('types')
          ]),
          new Up.PlainText(' of)')
        ]),
        new Up.PlainText(' pizza :)')
      ]))
  })
})


describe('An opening parentheses followed by whitespace', () => {
  it('does not open a parenthesized convention', () => {
    expect(Up.parse("I can't eat most pizza. 8o( But I can have some! 8o)")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText("I can't eat most pizza. 8o( But I can have some! 8o)")
      ]))
  })
})
