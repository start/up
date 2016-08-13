import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { HighlightNode } from '../../SyntaxNodes/HighlightNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


context('Bracketed text starting with "highlight:" is put inside a highlight node. The brackets can be:', () => {
 specify('Square brackets', () => {
    expect(Up.toAst('After you beat the Elite Four, [highlight: you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.toAst('After you beat the Elite Four, (highlight: you fight Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  specify('Curly brackets', () => {
    expect(Up.toAst('After you beat the Elite Four, {highlight: you fight Gary}.')).to.be.eql(
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

    expect(Up.toAst(withLowercase)).to.be.eql(Up.toAst(withRandomCase))
  })

  it('can use the term "mark" instead', () => {
    const withHighlight = 'After you beat the Elite Four, {highlight: you fight Gary}.'
    const withMark = 'After you beat the Elite Four, {mark: you fight Gary}.'

    expect(Up.toAst(withHighlight)).to.be.eql(Up.toAst(withMark))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toAst('After you beat the Elite Four, [highlight: you fight *Gary*].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight '),
          new EmphasisNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can be nested within another highlight convention', () => {
    expect(Up.toAst('After you beat the Elite Four, [highlight: you fight [highlight: Gary]].')).to.be.eql(
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
    expect(Up.toAst('After you beat the Elite Four, [highlight: you fight [and beat] Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight '),
          new SquareBracketedNode([
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
    expect(Up.toAst('After you beat the Elite Four, (highlight: you fight (and beat) Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight '),
          new ParenthesizedNode([
            new PlainTextNode('(and beat)')
          ]),
          new PlainTextNode(' Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A highlight produced by curly brackets', () => {
  it('can contain action text', () => {
    expect(Up.toAst('After you beat the Elite Four, {highlight: you still have to beat Gary {sigh}}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you still have to beat Gary '),
          new ActionNode([
            new PlainTextNode('sigh')
          ])
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any whitespace between "highlight:" and the start of the highlighted content', () => {
  it('is optional', () => {
    expect(Up.toAst('After you beat the Elite Four, [highlight:you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toAst('After you beat the Elite Four, [highlight: \t  \t you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new HighlightNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})
