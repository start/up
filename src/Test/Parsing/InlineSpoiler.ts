import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


describe('Square bracketed text starting with "SPOILER:"', () => {
  it('is put inside an inline spoiler node', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Parenthesized text starting with "SPOILER:"', () => {
  it('is put inside an inline spoiler node', () => {
    expect(Up.toDocument('After you beat the Elite Four, (SPOILER: you fight Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline spoiler convention', () => {
  it('can use any capitalization of the word "spoiler"', () => {
    const withLowercase = 'After you beat the Elite Four, [spoiler: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [SPoILeR: you fight Gary].'

    expect(Up.toDocument(withLowercase)).to.deep.equal(Up.toDocument(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER: you fight *Gary*].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight '),
          new Emphasis([
            new PlainText('Gary')
          ]),
        ]),
        new PlainText('.')
      ]))
  })

  it('can be nested within another spoiler convention', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER: you fight [SPOILER: Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight '),
          new InlineSpoiler([
            new PlainText('Gary')
          ]),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline spoiler produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER: you fight [and beat] Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight '),
          new SquareParenthetical([
            new PlainText('[and beat]')
          ]),
          new PlainText(' Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline spoiler produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toDocument('After you beat the Elite Four, (SPOILER: you fight (and beat) Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight '),
          new NormalParenthetical([
            new PlainText('(and beat)')
          ]),
          new PlainText(' Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Any whitespace between "SPOILER:" and the start of the spoiler content', () => {
  it('is optional', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER:you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER: \t  \t you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })
})
