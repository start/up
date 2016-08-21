import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Image } from '../../SyntaxNodes/Image'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


describe('Square bracketed text starting with "NSFW:"', () => {
  it('is put inside an inline NSFW node', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle a naked Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Parenthesized text starting with "NSFW:"', () => {
  it('is put inside a nsfw node', () => {
    expect(Up.toDocument('After you beat the Elite Four, (NSFW: you wrestle a naked Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle a naked Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An NSFW convention', () => {
  it('can use any capitalization of the word "nsfw"', () => {
    const withLowercase = 'After you beat the Elite Four, [nsfw: you wrestle a naked Gary].'
    const withRandomCase = 'After you beat the Elite Four, [NsFW: you wrestle a naked Gary].'

    expect(Up.toDocument(withLowercase)).to.be.eql(Up.toDocument(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle [image: naked Gary](https://example.com/ummmm.png)].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle '),
          new Image('naked Gary', 'https://example.com/ummmm.png'),
        ]),
        new PlainText('.')
      ]))
  })

  it('can be nested within another NSFW convention', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle [NSFW: a naked Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle '),
          new InlineNsfw([
            new PlainText('a naked Gary')
          ]),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle [and beat] a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle '),
          new SquareParenthetical([
            new PlainText('[and beat]')
          ]),
          new PlainText(' a naked Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A NSFW convnetion produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toDocument('After you beat the Elite Four, (NSFW: you wrestle (and beat) a naked Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle '),
          new NormalParenthetical([
            new PlainText('(and beat)')
          ]),
          new PlainText(' a naked Gary')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Any whitespace between "NSFW:" and the start of the NSFW content', () => {
  it('is optional', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW:you wrestle a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle a naked Gary')
        ]),
        new PlainText('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: \t  \t you wrestle a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle a naked Gary')
        ]),
        new PlainText('.')
      ]))
  })
})
