import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Image } from '../../SyntaxNodes/Image'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


describe('Square bracketed text starting with "NSFW:"', () => {
  it('is put inside an inline NSFL node', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat a rotting Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you eat a rotting Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Parenthesized text starting with "NSFW:"', () => {
  it('is put inside a nsfl node', () => {
    expect(Up.parse('After you beat the Elite Four, (NSFL: you eat a rotting Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you eat a rotting Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An NSFL convention', () => {
  it('can use any capitalization of the word "nsfl"', () => {
    const withLowercase = 'After you beat the Elite Four, [nsfl: you eat a rotting Gary].'
    const withRandomCase = 'After you beat the Elite Four, [nSfL: you eat a rotting Gary].'

    expect(Up.parse(withLowercase)).to.deep.equal(Up.parse(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat [image: rotting Gary](https://example.com/ummmm.png)].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you eat '),
          new Up.Image('rotting Gary', 'https://example.com/ummmm.png'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  it('can be nested within another NSFL convention', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat [NSFL: a rotting Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you eat '),
          new Up.InlineNsfl([
            new Up.PlainText('a rotting Gary')
          ]),
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline NSFL convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat [and finish] a rotting Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you eat '),
          new Up.SquareParenthetical([
            new Up.PlainText('[and finish]')
          ]),
          new Up.PlainText(' a rotting Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('A NSFL convnetion produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.parse('After you beat the Elite Four, (NSFL: you eat (and finish) a rotting Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you eat '),
          new Up.NormalParenthetical([
            new Up.PlainText('(and finish)')
          ]),
          new Up.PlainText(' a rotting Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Any whitespace between "NSFL:" and the start of the NSFL content', () => {
  it('is optional', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL:you wrestle a rotten Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you wrestle a rotten Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: \t  \t you wrestle a rotten Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.PlainText('you wrestle a rotten Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})
