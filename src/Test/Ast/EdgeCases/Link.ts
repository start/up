import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'


describe('Bracketed text followed by " -> " followed by a closing bracket', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('[Try to] do this -> smile :]')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('[Try to] do this -> smile :]')
      ]))
  })
})


describe('A link with no URL', () => {
  it("does not produce a link node, but its contents are evaulated for inline conventions and included directly in the link's place", () => {
    expect(Up.toAst('[*Yggdra Union* -> ]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with a blank URL', () => {
  it('does not produce a link node, but its contents are included directly', () => {
    expect(Up.toAst('[*Yggdra Union* ->   \t  ]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with no content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.toAst('[ -> https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]
      ))
  })
})


describe('A link with blank content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.toAst('[   \t   -> https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]))
  })
})


describe('A link with no content and no URL', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('Hello, [ -> ]!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, !')
      ])
    )
  })
})


describe('A paragraph containing a link with no content and no URL', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('[ -> ]')).to.be.eql(new DocumentNode([]))
  })
})


describe('A link', () => {
  it('can follow bracketed text', () => {
    expect(Up.toAst("I [usually] use [Google -> https://google.com]!!")).to.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I [usually] use '),
        new LinkNode([
          new PlainTextNode('Google')
        ], 'https://google.com'),
        new PlainTextNode('!!')
      ]))
  })

  it('can be inside bracketed text', () => {
    expect(Up.toAst("[I use [Google -> https://google.com]]")).to.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[I use '),
          new LinkNode([
            new PlainTextNode('Google')
          ], 'https://google.com'),
          new PlainTextNode(']')
        ])
      ]))
  })

  it('starts with the final of multiple opening brackets even when there is just one closing bracket', () => {
    expect(Up.toAst('Go to [this [site -> https://stackoverflow.com]!!')).to.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Go to [this '),
        new LinkNode([
          new PlainTextNode('site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('!!')
      ]))
  })
})


describe("A link's contents", () => {
  it('can contain inline code containing an unmatched closing bracket', () => {
    expect(Up.toAst('I like [`poor_syntax]` -> https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new InlineCodeNode('poor_syntax]')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })

  it('can contain an escaped unmatched closing bracket', () => {
    expect(Up.toAst('I like [weird brackets\\] -> https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('weird brackets]')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })
})


describe("Unmatched opening parentheses in a link's URL", () => {
  it('do not affect any text that follows the link', () => {
    const text = '((He won [West Virginia -> https://example.com/a(normal(url] easily.))'

    const footnote = new FootnoteNode([
      new PlainTextNode('He won '),
      new LinkNode([
        new PlainTextNode('West Virginia')
      ], 'https://example.com/a(normal(url'),
      new PlainTextNode(' easily.')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })
})

describe('A link missing its final closing bracket', () => {
  it('does not prevent conventions from being evaluated afterward', () => {
    expect(Up.toAst('[: Do this -> smile! Anyway, why is *everyone* greeting mother earth?')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('[: Do this -> smile! Anyway, why is '),
        new EmphasisNode([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(' greeting mother earth?')
      ]))
  })
})
