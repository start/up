
import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'



describe('An image without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[o_o: -> http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An image with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[o_o:\t   -> http://example.com/hauntedhouse.svg]')).to.be.eql(
      new DocumentNode([
        new ImageNode('http://example.com/hauntedhouse.svg', 'http://example.com/hauntedhouse.svg')
      ]))
  })
})


describe('An image with a blank URL', () => {
  it('is not included in the document', () => {
    expect(Up.toAst('[o_o: haunted house ->    \t]')).to.be.eql(
      new DocumentNode([]))
  })
})


describe('A paragraph directly followed by an image on its own line', () => {
  it('produces a pagraph node followed by an image node, not a line block', () => {
    const text = `
Do not pour the spiders into your sister's cereal.
[o_o: sister arraigned on charges -> http://example.com/court.jpg]`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new ImageNode('sister arraigned on charges', 'http://example.com/court.jpg'),
      ]))
  })
})


describe('An otherwise valid image convention prematurely terminated by an unmatched closing bracket in its description', () => {
  it('is treated as plain text', () => {
    expect(Up.toAst('[o_o: dank memes] -> 8]')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('[o_o: dank memes] -> 8]'),
        ])
      ]))
  })
})
