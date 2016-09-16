import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Square bracketed text starting with "NSFW:"', () => {
  it('is put inside an inline NSFL node', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat a rotting Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat a rotting Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Parenthesized text starting with "NSFW:"', () => {
  it('is put inside a nsfl node', () => {
    expect(Up.parse('After you beat the Elite Four, (NSFL: you eat a rotting Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat a rotting Gary')
        ]),
        new Up.Text('.')
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
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat '),
          new Up.Image('rotting Gary', 'https://example.com/ummmm.png'),
        ]),
        new Up.Text('.')
      ]))
  })

  it('can be nested within another NSFL convention', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat [NSFL: a rotting Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat '),
          new Up.InlineNsfl([
            new Up.Text('a rotting Gary')
          ]),
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline NSFL convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat [and finish] a rotting Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat '),
          new Up.SquareParenthetical([
            new Up.Text('[and finish]')
          ]),
          new Up.Text(' a rotting Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A NSFL convnetion produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.parse('After you beat the Elite Four, (NSFL: you eat (and finish) a rotting Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat '),
          new Up.NormalParenthetical([
            new Up.Text('(and finish)')
          ]),
          new Up.Text(' a rotting Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Any whitespace between "NSFL:" and the start of the NSFL content', () => {
  it('is optional', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL:you wrestle a rotten Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you wrestle a rotten Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: \t  \t you wrestle a rotten Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you wrestle a rotten Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})
