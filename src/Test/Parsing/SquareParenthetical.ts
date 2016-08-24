import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'


describe('Text surrounded by square brackets', () => {
  it('is put inside a square parenthetical node with the square brackets preserved as plain text', () => {
    expect(Up.toDocument('I like [certain types of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[certain types of]')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Square bracketed text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('I like [certain *types* of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[certain '),
          new Emphasis([
            new PlainText('types')
          ]),
          new PlainText(' of]')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Nested square brackets (starting at the same time)', () => {
  it("produce nested square parenthetical nodes with first opening bracket outside of the inner node", () => {
    expect(Up.toDocument('I like [[certain] types of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('['),
          new SquareParenthetical([
            new PlainText('[certain]')
          ]),
          new PlainText(' types of]')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Nested square brackets (ending at the same time)', () => {
  it("produce nested square parenthetical nodes with last closing square bracket outside of the inner node", () => {
    expect(Up.toDocument('I like [certain [types of]] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[certain '),
          new SquareParenthetical([
            new PlainText('[types of]')
          ]),
          new PlainText(']')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('Two left square brackets followed by a single right square bracket', () => {
  it('produces bracketed text starting from the second left square bracket', () => {
    expect(Up.toDocument(':[ I like [certain *types* of] pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText(':[ I like '),
        new SquareParenthetical([
          new PlainText('[certain '),
          new Emphasis([
            new PlainText('types')
          ]),
          new PlainText(' of]')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('A left square bracket followed by two right square brackets', () => {
  it('produces bracketed text ending with the first right square bracket', () => {
    expect(Up.toDocument('I like [certain *types* of] pizza :]')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[certain '),
          new Emphasis([
            new PlainText('types')
          ]),
          new PlainText(' of]')
        ]),
        new PlainText(' pizza :]')
      ]))
  })
})


describe('A square bracket followed by whitespace', () => {
  it('does not open a square bracketed convention', () => {
    expect(Up.toDocument("I can't eat most pizza. 8o[ But I can have some! 8o]")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("I can't eat most pizza. 8o[ But I can have some! 8o]")
      ]))
  })
})
