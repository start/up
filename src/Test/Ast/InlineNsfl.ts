import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


describe('Square bracketed text starting with "nsfl:"', () => {
  it('is put inside a NSFL node', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat a rotting Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat a rotting Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Parenthesized text starting with "nsfl:"', () => {
  it('is put inside a nsfl node', () => {
    expect(Up.toAst('After you beat the Elite Four, (NSFL: you eat a rotting Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat a rotting Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Curly bracketed text starting with "nsfl:"', () => {
  it('is put inside a NSFL node', () => {
    expect(Up.toAst('After you beat the Elite Four, {NSFL: you eat a rotting Gary}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat a rotting Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An NSFL convention', () => {
  it('can use any capitalization of the word "nsfl"', () => {
    const withLowercase = 'After you beat the Elite Four, [nsfl: you eat a rotting Gary].'
    const withRandomCase = 'After you beat the Elite Four, [nSfL: you eat a rotting Gary].'
    
    expect(Up.toAst(withLowercase)).to.be.eql(Up.toAst(withRandomCase))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat [image: rotting Gary](https://example.com/ummmm.png)].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat '),
          new ImageNode('rotting Gary', 'https://example.com/ummmm.png'),
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can be nested within another NSFL convention', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat [NSFL: a rotting Gary]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat '),
          new InlineNsflNode([
            new PlainTextNode('a rotting Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFL convention produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: you eat [and finish] a rotting Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat '),
          new SquareBracketedNode([
            new PlainTextNode('[and finish]')
          ]),
          new PlainTextNode(' a rotting Gary')          
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFL convnetion produced by parentheses', () => {
  it('can contain parenthesized text', () => {
    expect(Up.toAst('After you beat the Elite Four, (NSFL: you eat (and finish) a rotting Gary).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you eat '),
          new ParenthesizedNode([
            new PlainTextNode('(and finish)')
          ]),
          new PlainTextNode(' a rotting Gary')          
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A NSFL convention produced by curly brackets', () => {
  it('can contain action text', () => {
    expect(Up.toAst('After you beat the Elite Four, {NSFL: you still have to eat a rotting Gary {sigh}}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you still have to eat a rotting Gary '),
          new ActionNode([
            new PlainTextNode('sigh')
          ])          
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Any whitespace between "NSFL:" and the start of the NSFL content', () => {
  it('is optional', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL:you wrestle a rotten Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you wrestle a rotten Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('is ignored', () => {
    expect(Up.toAst('After you beat the Elite Four, [NSFL: \t  \t you wrestle a rotten Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineNsflNode([
          new PlainTextNode('you wrestle a rotten Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})