import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


context('Bracketed text starting with "highlight:" is put inside a highlight node. The brackets can be:', () => {
 specify('Square brackets', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.toDocument('After you beat the Elite Four, (highlight: you fight Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A highlight convention', () => {
  it('can use any capitalization of the word "highlight"', () => {
    const withLowercase = 'After you beat the Elite Four, [highlight: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [hIghLiGHt: you fight Gary].'

    expect(Up.toDocument(withLowercase)).to.deep.equal(Up.toDocument(withRandomCase))
  })

  it('can use the term "mark" instead', () => {
    const withHighlight = 'After you beat the Elite Four, [highlight: you fight Gary].'
    const withMark = 'After you beat the Elite Four, [mark: you fight Gary].'

    expect(Up.toDocument(withHighlight)).to.deep.equal(Up.toDocument(withMark))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight *Gary*].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight '),
          new Emphasis([
            new PlainText('Gary')
          ]),
        ]),
        new PlainText('.')
      ]))
  })

  it('can be nested within another highlight convention', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight [highlight: Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight '),
          new Highlight([
            new PlainText('Gary')
          ]),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A highlight produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight [and beat] Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
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


describe('A highlight produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toDocument('After you beat the Elite Four, (highlight: you fight (and beat) Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
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


describe('Any whitespace between "highlight:" and the start of the highlighted content', () => {
  it('is optional', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight:you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: \t  \t you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new PlainText('.')
      ]))
  })
})
