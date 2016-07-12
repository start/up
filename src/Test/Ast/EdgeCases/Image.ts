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