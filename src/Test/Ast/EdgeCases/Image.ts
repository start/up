import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'


describe('An image with an empty description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[image:][http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An image with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[image:\t  ][http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An image with a blank URL', () => {
  it('is not included in the document', () => {
    expect(Up.toAst('[image: haunted house][   \t]')).to.be.eql(
      new DocumentNode([]))
  })
})


describe("An otherwise-valid image missing its bracketed URL is treated as bracketed text, not an image. This applies when the bracketed description is followed by", () => {
  specify('nothing', () => {
    expect(Up.toAst('[image: haunted house]')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new SquareBracketedNode([
            new PlainTextNode('[image: haunted house]')
          ])
        ])
      ]))
  })

  specify('something other than bracketed text (and other than whitespace followed by a bracketed text)', () => {
    expect(Up.toAst('[image: haunted house] was written on the desk')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new SquareBracketedNode([
            new PlainTextNode('[image: haunted house]')
          ]),
          new PlainTextNode(' was written on the desk')
        ])
      ]))
  })

  specify('something other than a bracketed URL, even when bracketed text eventually follows', () => {
    expect(Up.toAst('[image: haunted house] was written on the desk [really]')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new SquareBracketedNode([
            new PlainTextNode('[image: haunted house]')
          ]),
          new PlainTextNode(' was written on the desk '),
          new SquareBracketedNode([
            new PlainTextNode('[really]')
          ]),
        ])
      ]))
  })
})


describe('A paragraph directly followed by an image on its own line', () => {
  it('produces a pagraph node followed by an image node, not a line block', () => {
    const text = `
Do not pour the spiders into your sister's cereal.
[image: sister arraigned on charges][http://example.com/court.jpg]`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new ImageNode('sister arraigned on charges', 'http://example.com/court.jpg'),
      ]))
  })
})


describe('An otherwise valid image convention with mismatched brackets surrounding its description', () => {
  it('does not produce an image node', () => {
    expect(Up.toAst('I like [image: ghosts}(http://example.com/ghosts.svg).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like [image: ghosts}'),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com/ghosts.svg')
          ], 'http://example.com/ghosts.svg'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An otherwise valid image convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a image node', () => {
    expect(Up.toAst('I like [image: ghosts][http://example.com/ghosts.svg).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new SquareBracketedNode([
          new PlainTextNode('[image: ghosts]')
        ]),
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('example.com/ghosts.svg).')
        ], 'http://example.com/ghosts.svg).'),
      ]))
  })
})


context('Unmatched opening parentheses in an image description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.toAst('[image: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.be.eql(
      new DocumentNode([
        new ImageNode('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.toAst('([image: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new ParenthesizedNode([
            new PlainTextNode('('),
            new ImageNode('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new PlainTextNode(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in an image URL", () => {
  it('do not affect any text that follows the link', () => {
    const text = '(^[image: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new FootnoteNode([
      new ImageNode('West Virginia exit polling', 'https://example.com/a(normal(url'),
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


describe("A line consistingly solely of a link that contains both an image and regular text", () => {
  it("produces a paragraph node", () => {
    expect(Up.toAst('[Look: (image: haunted house) {http://example.com/hauntedhouse.svg}] (https://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Look: '),
          new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
        ], 'https://example.com')
      ]))
  })
})