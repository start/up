import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Square bracketed text starting with "NSFW:"', () => {
  it('is put inside an inline NSFW node', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle a naked Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle a naked Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Parenthesized text starting with "NSFW:"', () => {
  it('is put inside a nsfw node', () => {
    expect(Up.parse('After you beat the Elite Four, (NSFW: you wrestle a naked Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle a naked Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An NSFW convention', () => {
  it('can use any capitalization of the word "nsfw"', () => {
    const withLowercase = 'After you beat the Elite Four, [nsfw: you wrestle a naked Gary].'
    const withRandomCase = 'After you beat the Elite Four, [NsFW: you wrestle a naked Gary].'

    expect(Up.parse(withLowercase)).to.deep.equal(Up.parse(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle [image: naked Gary](https://example.com/ummmm.png)].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle '),
          new Up.Image('naked Gary', 'https://example.com/ummmm.png'),
        ]),
        new Up.PlainText('.')
      ]))
  })

  it('can be nested within another NSFW convention', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle [NSFW: a naked Gary]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle '),
          new Up.InlineNsfw([
            new Up.PlainText('a naked Gary')
          ]),
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle [and beat] a naked Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle '),
          new Up.SquareParenthetical([
            new Up.PlainText('[and beat]')
          ]),
          new Up.PlainText(' a naked Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('A NSFW convnetion produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.parse('After you beat the Elite Four, (NSFW: you wrestle (and beat) a naked Gary).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle '),
          new Up.NormalParenthetical([
            new Up.PlainText('(and beat)')
          ]),
          new Up.PlainText(' a naked Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Any whitespace between "NSFW:" and the start of the NSFW content', () => {
  it('is optional', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW:you wrestle a naked Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle a naked Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: \t  \t you wrestle a naked Gary].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle a naked Gary')
        ]),
        new Up.PlainText('.')
      ]))
  })
})
