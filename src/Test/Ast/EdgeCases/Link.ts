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
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'


describe('An otherwise valid link with mismatched brackets surrounding its description', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('I like [this site}(https://stackoverflow.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like [this site}'),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('stackoverflow.com')
          ], 'https://stackoverflow.com'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An otherwise valid link with mismatched brackets surrounding its URL', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('I like [this site][https://stackoverflow.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new SquareBracketedNode([
          new PlainTextNode('[this site]')
        ]),
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('stackoverflow.com).')
        ], 'https://stackoverflow.com).'),
      ]))
  })
})


describe('A link produced by square brackets', () => {
  it('can follow square bracketed text', () => {
    expect(Up.toAst("I [usually] use [Google][https://google.com]!!")).to.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new SquareBracketedNode([
          new PlainTextNode('[usually]')
        ]),
        new PlainTextNode(' use '),
        new LinkNode([
          new PlainTextNode('Google')
        ], 'https://google.com'),
        new PlainTextNode('!!')
      ]))
  })

  it('can be inside square bracketed text', () => {
    expect(Up.toAst("[I use [Google][https://google.com]]")).to.eql(
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

  it('starts with the final of multiple opening square brackets even when there is just one closing square bracket', () => {
    expect(Up.toAst('Go to [this [site][https://stackoverflow.com]!!')).to.eql(
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
    expect(Up.toAst('I like [`poor_syntax]`][https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new InlineCodeNode('poor_syntax]')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })

  it('can contain an escaped unmatched closing bracket', () => {
    expect(Up.toAst('I like [weird brackets\\]][https://stackoverflow.com].')).to.be.eql(
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
    const text = '((He won [West Virginia][https://example.com/a(normal(url] easily.))'

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
  it('does not produce a link node and does not prevent conventions from being evaluated afterward', () => {
    expect(Up.toAst('[: Do this :][: smile! Anyway, why is *everyone* greeting mother earth?')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[: Do this :]'),
        ]),
        new PlainTextNode('[: smile! Anyway, why is '),
        new EmphasisNode([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(' greeting mother earth?')
      ]))
  })
})


describe("Bracketed text followed by a parenthesized URL starting with an open parenthesis (that gets matched at some point before the URL ends)", () => {
  it('produce a link node (whose URL is prefixed by the default scheme)', () => {
    expect(Up.toAst('See the [documentation]((parenthetical)operators).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('See the '),
        new LinkNode([
          new PlainTextNode('documentation')
        ], 'https://(parenthetical)operators'),
        new PlainTextNode('.')
      ]))
  })
})



context('Parenthesized text followed by whitespace followed by an empty bracketed convention does not produce a link. Specificaly, parenthesized text can be followed by:', () => {
  specify('Spoilers', () => {
    expect(Up.toAst('(I know.) [SPOILER:]')).to.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know.)')
        ]),
        new PlainTextNode(' ')
      ])
    )
  })

  specify('NSFW', () => {
    expect(Up.toAst('(I know.) [NSFW:]')).to.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know.)')
        ]),
        new PlainTextNode(' ')
      ])
    )
  })

  specify('NSFL', () => {
    expect(Up.toAst('(I know.) [NSFL:]')).to.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know.)')
        ]),
        new PlainTextNode(' ')
      ])
    )
  })

  specify('Parentheses', () => {
    expect(Up.toAst('(I know.) ()')).to.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know.)')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('()')
        ])
      ])
    )
  })

  specify('Square brackets', () => {
    expect(Up.toAst('(I know.) []')).to.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know.)')
        ]),
        new PlainTextNode(' '),
        new SquareBracketedNode([
          new PlainTextNode('[]')
        ])
      ])
    )
  })

  specify('Actions', () => {
    expect(Up.toAst('(I know.) {}')).to.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know.)')
        ]),
        new PlainTextNode(' ')
      ])
    )
  })
})