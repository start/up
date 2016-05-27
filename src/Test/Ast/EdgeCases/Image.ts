import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'


describe('An image without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[image:][ttp://example.com/hauntedhouse.svg]')).to.be.eql(
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


describe('An otherwise valid image convention with a space between its bracketed description and its bracketed URL', () => {
  it('is treated as plain text', () => {
    expect(Up.toAst('[image: maymay] [o_o]')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new SquareBracketedNode([
            new PlainTextNode('[image: maymay]')
          ]),
          new SquareBracketedNode([
            new PlainTextNode('[o_o]')
          ]),
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in an image URL", () => {
  it('do not affect any text that follows the link', () => {
    const text = '(([image: West Virginia exit polling][https://example.com/a(normal(url]))'

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
