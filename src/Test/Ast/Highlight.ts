import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { HighlightNode } from '../../SyntaxNodes/HighlightNode'
import { SquareParentheticalNode } from '../../SyntaxNodes/SquareParentheticalNode'
import { NormalParentheticalNode } from '../../SyntaxNodes/NormalParentheticalNode'


context('Bracketed text starting with "highlight:" is put inside a highlight node. The brackets can be:', () => {
 specify('Square brackets', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.toDocument('After you beat the Elite Four, (highlight: you fight Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A highlight convention', () => {
  it('can use any capitalization of the word "highlight"', () => {
    const withLowercase = 'After you beat the Elite Four, [highlight: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [hIghLiGHt: you fight Gary].'

    expect(Up.toDocument(withLowercase)).to.be.eql(Up.toDocument(withRandomCase))
  })

  it('can use the term "mark" instead', () => {
    const withHighlight = 'After you beat the Elite Four, [highlight: you fight Gary].'
    const withMark = 'After you beat the Elite Four, [mark: you fight Gary].'

    expect(Up.toDocument(withHighlight)).to.be.eql(Up.toDocument(withMark))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight *Gary*].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight '),
          new Emphasis([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can be nested within another highlight convention', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight [highlight: Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight '),
          new HighlightNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A highlight produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight [and beat] Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight '),
          new SquareParentheticalNode([
            new PlainTextNode('[and beat]')
          ]),
          new PlainTextNode(' Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A highlight produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toDocument('After you beat the Elite Four, (highlight: you fight (and beat) Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight '),
          new NormalParentheticalNode([
            new PlainTextNode('(and beat)')
          ]),
          new PlainTextNode(' Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any whitespace between "highlight:" and the start of the highlighted content', () => {
  it('is optional', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight:you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: \t  \t you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})
