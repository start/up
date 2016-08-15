import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { SquareBracketParentheticalNode } from '../../SyntaxNodes/SquareBracketParentheticalNode'
import { NormalParentheticalNode } from '../../SyntaxNodes/NormalParentheticalNode'


describe('Square bracketed text starting with "NSFW:"', () => {
  it('is put inside an inline NSFW node', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle a naked Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Parenthesized text starting with "NSFW:"', () => {
  it('is put inside a nsfw node', () => {
    expect(Up.toDocument('After you beat the Elite Four, (NSFW: you wrestle a naked Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle a naked Gary')
        ]),
        new PlainTextNode('.')
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
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle '),
          new ImageNode('naked Gary', 'https://example.com/ummmm.png'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can be nested within another NSFW convention', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle [NSFW: a naked Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle '),
          new InlineNsfwNode([
            new PlainTextNode('a naked Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An inline NSFW convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle [and beat] a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle '),
          new SquareBracketParentheticalNode([
            new PlainTextNode('[and beat]')
          ]),
          new PlainTextNode(' a naked Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFW convnetion produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toDocument('After you beat the Elite Four, (NSFW: you wrestle (and beat) a naked Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle '),
          new NormalParentheticalNode([
            new PlainTextNode('(and beat)')
          ]),
          new PlainTextNode(' a naked Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any whitespace between "NSFW:" and the start of the NSFW content', () => {
  it('is optional', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW:you wrestle a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle a naked Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: \t  \t you wrestle a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsfwNode([
          new PlainTextNode('you wrestle a naked Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})
