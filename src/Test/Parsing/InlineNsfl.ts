import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Image } from '../../SyntaxNodes/Image'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


describe('Square bracketed text starting with "NSFW:"', () => {
  it('is put inside an inline NSFL node', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat a rotting Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat a rotting Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Parenthesized text starting with "NSFW:"', () => {
  it('is put inside a nsfl node', () => {
    expect(Up.toDocument('After you beat the Elite Four, (NSFL: you eat a rotting Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat a rotting Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An NSFL convention', () => {
  it('can use any capitalization of the word "nsfl"', () => {
    const withLowercase = 'After you beat the Elite Four, [nsfl: you eat a rotting Gary].'
    const withRandomCase = 'After you beat the Elite Four, [nSfL: you eat a rotting Gary].'

    expect(Up.toDocument(withLowercase)).to.be.eql(Up.toDocument(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat [image: rotting Gary](https://example.com/ummmm.png)].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat '),
          new Image('rotting Gary', 'https://example.com/ummmm.png'),
        ]),
        new PlainText('.')
      ]))
  })

  it('can be nested within another NSFL convention', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat [NSFL: a rotting Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat '),
          new InlineNsfl([
            new PlainText('a rotting Gary')
          ]),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFL convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat [and finish] a rotting Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat '),
          new SquareParenthetical([
            new PlainText('[and finish]')
          ]),
          new PlainText(' a rotting Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A NSFL convnetion produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toDocument('After you beat the Elite Four, (NSFL: you eat (and finish) a rotting Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat '),
          new NormalParenthetical([
            new PlainText('(and finish)')
          ]),
          new PlainText(' a rotting Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Any whitespace between "NSFL:" and the start of the NSFL content', () => {
  it('is optional', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL:you wrestle a rotten Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you wrestle a rotten Gary')
        ]),
        new PlainText('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: \t  \t you wrestle a rotten Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you wrestle a rotten Gary')
        ]),
        new PlainText('.')
      ]))
  })
})
