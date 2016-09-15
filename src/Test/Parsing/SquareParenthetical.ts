import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by square brackets', () => {
  it('is put inside a square parenthetical node with the square brackets preserved as plain text', () => {
    expect(Up.parse('I like [certain types of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('[certain types of]')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Square bracketed text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.parse('I like [certain *types* of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('[certain '),
          new Up.Emphasis([
            new Up.PlainText('types')
          ]),
          new Up.PlainText(' of]')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Nested square brackets (starting at the same time)', () => {
  it("produce nested square parenthetical nodes with first opening bracket outside of the inner node", () => {
    expect(Up.parse('I like [[certain] types of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('['),
          new Up.SquareParenthetical([
            new Up.PlainText('[certain]')
          ]),
          new Up.PlainText(' types of]')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Nested square brackets (ending at the same time)', () => {
  it("produce nested square parenthetical nodes with last closing square bracket outside of the inner node", () => {
    expect(Up.parse('I like [certain [types of]] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('[certain '),
          new Up.SquareParenthetical([
            new Up.PlainText('[types of]')
          ]),
          new Up.PlainText(']')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('Two left square brackets followed by a single right square bracket', () => {
  it('produces bracketed text starting from the second left square bracket', () => {
    expect(Up.parse(':[ I like [certain *types* of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText(':[ I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('[certain '),
          new Up.Emphasis([
            new Up.PlainText('types')
          ]),
          new Up.PlainText(' of]')
        ]),
        new Up.PlainText(' pizza')
      ]))
  })
})


describe('A left square bracket followed by two right square brackets', () => {
  it('produces bracketed text ending with the first right square bracket', () => {
    expect(Up.parse('I like [certain *types* of] pizza :]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('[certain '),
          new Up.Emphasis([
            new Up.PlainText('types')
          ]),
          new Up.PlainText(' of]')
        ]),
        new Up.PlainText(' pizza :]')
      ]))
  })
})


describe('A square bracket followed by whitespace', () => {
  it('does not open a square bracketed convention', () => {
    expect(Up.parse("I can't eat most pizza. 8o[ But I can have some! 8o]")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText("I can't eat most pizza. 8o[ But I can have some! 8o]")
      ]))
  })
})
