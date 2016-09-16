import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


context('Bracketed text starting with "highlight:" is put inside a highlight node. The brackets can be:', () => {
 specify('Square brackets', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.parse('After you beat the Elite Four, (highlight: you fight Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A highlight convention', () => {
  it('can use any capitalization of the word "highlight"', () => {
    const withLowercase = 'After you beat the Elite Four, [highlight: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [hIghLiGHt: you fight Gary].'

    expect(Up.parse(withLowercase)).to.deep.equal(Up.parse(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight *Gary*].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight '),
          new Up.Emphasis([
            new Up.Text('Gary')
          ]),
        ]),
        new Up.Text('.')
      ]))
  })

  it('can be nested within another highlight convention', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight [highlight: Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight '),
          new Up.Highlight([
            new Up.Text('Gary')
          ]),
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A highlight produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight [and beat] Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight '),
          new Up.SquareParenthetical([
            new Up.Text('[and beat]')
          ]),
          new Up.Text(' Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A highlight produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.parse('After you beat the Elite Four, (highlight: you fight (and beat) Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight '),
          new Up.NormalParenthetical([
            new Up.Text('(and beat)')
          ]),
          new Up.Text(' Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Any whitespace between "highlight:" and the start of the highlighted content', () => {
  it('is optional', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight:you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: \t  \t you fight Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})
