import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'


describe('Square bracketed text starting with "SPOILER:"', () => {
  it('is put inside an inline spoiler node', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Parenthesized text starting with "SPOILER:"', () => {
  it('is put inside an inline spoiler node', () => {
    expect(Up.toAst('After you beat the Elite Four, (SPOILER: you fight Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Curly bracketed text starting with "SPOILER:"', () => {
  it('is put inside an inline spoiler node', () => {
    expect(Up.toAst('After you beat the Elite Four, {SPOILER: you fight Gary}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An inline spoiler convention', () => {
  it('can use any capitalization of the word "spoiler"', () => {
    const withLowercase = 'After you beat the Elite Four, [spoiler: you fight Gary].'
    const withRandomCase = 'After you beat the Elite Four, [SPoILeR: you fight Gary].'

    expect(Up.toAst(withLowercase)).to.be.eql(Up.toAst(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight *Gary*].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you fight '),
          new EmphasisNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can be nested within another spoiler convention', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight [SPOILER: Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you fight '),
          new InlineSpoilerNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An inline spoiler produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight [and beat] Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
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


describe('An inline spoiler produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toAst('After you beat the Elite Four, (SPOILER: you fight (and beat) Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
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

/*
TODO: Replace this test

describe('An inline spoiler produced by curly brackets', () => {
  it('can contain action text', () => {
    expect(Up.toAst('After you beat the Elite Four, {SPOILER: you still have to beat Gary {sigh}}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you still have to beat Gary '),
          new ActionNode([
            new PlainTextNode('sigh')
          ])
        ]),
        new PlainTextNode('.')
      ]))
  })
})
*/

describe('Any whitespace between "SPOILER:" and the start of the spoiler content', () => {
  it('is optional', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER:you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: \t  \t you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})
