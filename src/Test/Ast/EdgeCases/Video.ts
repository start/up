import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe('A video without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[video: -> http://example.com/poltergeists.webm]')).to.be.eql(
      new DocumentNode([
        new VideoNode('http://example.com/poltergeists.webm', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[video:  \t  -> http://example.com/poltergeists.webm]')).to.be.eql(
      new DocumentNode([
        new VideoNode('http://example.com/poltergeists.webm', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video with a blank URL', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[video: ghosts eating luggage ->    \t  ]')).to.be.eql(
      new DocumentNode([]))
  })
})


describe('A paragraph directly followed by a video on its own line', () => {
  it('produces a pagraph node followed by a video node, not a line block', () => {
    const text = `
Do not pour the spiders into your sister's cereal.
[video: spiders crawling out of mouth -> http://example.com/spiders.webm]`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new VideoNode('spiders crawling out of mouth', 'http://example.com/spiders.webm'),
      ]))
  })
})


describe('An otherwise valid video convention prematurely terminated by an unmatched closing bracket in its description', () => {
  it('is treated as plain text', () => {
    expect(Up.toAst('[video: memes] -> 8]')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('[video: memes] -> 8]'),
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a video's url", () => {
  it('do not affect any text that follows the link', () => {
    const text = '(([video: West Virginia exit polling -> https://example.com/a(normal(url]))'

    const footnote = new FootnoteNode([
      new VideoNode('West Virginia exit polling', 'https://example.com/a(normal(url'),
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