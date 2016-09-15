import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Square bracketed text starting with "SPOILER:"', () => {
  it('is put inside an inline spoiler node', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Parenthesized text starting with "SPOILER:"', () => {
  it('is put inside an inline spoiler node', () => {
    expect(Up.parse('After you beat the Elite Four, (SPOILER: you fight Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline spoiler convention', () => {
  it('can use any capitalization of the word "spoiler"', () => {
    const withLowercase = 'After you beat the Elite Four, [spoiler: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [SPoILeR: you fight Gary].'

    expect(Up.parse(withLowercase)).to.deep.equal(Up.parse(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight *Gary*].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight '),
          new Up.Emphasis([
            new Up.PlainText('Gary')
          ]),
        ]),
        new Up.PlainText('.')
      ]))
  })

  it('can be nested within another spoiler convention', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight [SPOILER: Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight '),
          new Up.InlineSpoiler([
            new Up.PlainText('Gary')
          ]),
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline spoiler produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight [and beat] Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight '),
          new Up.SquareParenthetical([
            new Up.PlainText('[and beat]')
          ]),
          new Up.PlainText(' Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline spoiler produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.parse('After you beat the Elite Four, (SPOILER: you fight (and beat) Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight '),
          new Up.NormalParenthetical([
            new Up.PlainText('(and beat)')
          ]),
          new Up.PlainText(' Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Any whitespace between "SPOILER:" and the start of the spoiler content', () => {
  it('is optional', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER:you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: \t  \t you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})
