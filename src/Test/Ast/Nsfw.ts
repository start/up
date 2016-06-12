import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { NsfwNode } from '../../SyntaxNodes/NsfwNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


describe('Square bracketed text starting with "nsfw:"', () => {
  it('is put inside a NSFW node', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you wrestle a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode('you wrestle a naked Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Parenthesized text starting with "nsfw:"', () => {
  it('is put inside a nsfw node', () => {
    expect(Up.toAst('After you beat the Elite Four, (NSFW: you wrestle a naked Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode('you wrestle a naked Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Curly bracketed text starting with "nsfw:"', () => {
  it('is put inside a NSFW node', () => {
    expect(Up.toAst('After you beat the Elite Four, {NSFW: you wrestle a naked Gary}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
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
    
    expect(Up.toAst(withLowercase)).to.be.eql(Up.toAst(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you wrestle [image: naked Gary](https://example.com/ummmm.png)].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode('you wrestle '),
          new ImageNode('naked Gary', 'https://example.com/ummmm.png'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can be nested within another NSFW convention', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you wrestle [NSFW: a naked Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode('you wrestle '),
          new NsfwNode([
            new PlainTextNode('a naked Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFW convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFW: you wrestle [and beat] a naked Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode('you wrestle '),
          new SquareBracketedNode([
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
    expect(Up.toAst('After you beat the Elite Four, (NSFW: you wrestle (and beat) a naked Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode('you wrestle '),
          new ParenthesizedNode([
            new PlainTextNode('(and beat)')
          ]),
          new PlainTextNode(' a naked Gary')          
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFW convention produced by curly brackets', () => {
  it('can contain action text', () => {
    expect(Up.toAst('After you beat the Elite Four, {NSFW: you still have to wrestle a naked Gary {sigh}}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new NsfwNode([
          new PlainTextNode('you still have to wrestle a naked Gary '),
          new ActionNode([
            new PlainTextNode('sigh')
          ])          
        ]),
        new PlainTextNode('.')
      ]))
  })
})
