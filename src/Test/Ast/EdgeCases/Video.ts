import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'


describe('A video without a description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[video:][http://example.com/poltergeists.webm]')).to.be.eql(
      new DocumentNode([
        new VideoNode('http://example.com/poltergeists.webm', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video with a blank description', () => {
  it('has its URL treated as its description', () => {
    expect(Up.toAst('[video:  \t ][http://example.com/poltergeists.webm]')).to.be.eql(
      new DocumentNode([
        new VideoNode('http://example.com/poltergeists.webm', 'http://example.com/poltergeists.webm')
      ]))
  })
})


describe('A video with a blank URL', () => {
  it('is not included in the document', () => {
    expect(Up.toAst('[video: ghosts eating luggage][   \t  ]')).to.be.eql(
      new DocumentNode([]))
  })
})


describe('A paragraph directly followed by a video on its own line', () => {
  it('produces a pagraph node followed by a video node, not a line block', () => {
    const text = `
Do not pour the spiders into your sister's cereal.
[video: spiders crawling out of mouth][http://example.com/spiders.webm]`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new VideoNode('spiders crawling out of mouth', 'http://example.com/spiders.webm'),
      ]))
  })
})


describe('An otherwise valid video convention with mismatched brackets surrounding its description', () => {
  it('does not produce an video node', () => {
    expect(Up.toAst('I like [video: ghosts}(http://example.com/ghosts.webm).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like [video: ghosts}'),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com/ghosts.webm')
          ], 'http://example.com/ghosts.webm'),
          new PlainTextNode(')'),
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('An otherwise valid video convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a video node', () => {
    expect(Up.toAst('I like [video: ghosts][http://example.com/ghosts.webm).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new SquareBracketedNode([
          new PlainTextNode('[video: ghosts]')
        ]),
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('example.com/ghosts.webm).')
        ], 'http://example.com/ghosts.webm).'),
      ]))
  })
})


describe("Unmatched opening parentheses in a video URL", () => {
  it('do not affect any text that follows the link', () => {
    const text = '(([video: West Virginia exit polling][https://example.com/a(normal(url]))'

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


describe('A full video convention (description and URL) directly followed by another parenthesized link', () => {
  it('is not "linkified" like a spoiler would be. Instead, it produces a video node followed by a parenthesized naked URL', () => {
    expect(Up.toAst('[video: ghostly howling](http://example.com/ghosts.ogg)(http://bulbapedia.bulbagarden.net/wiki/Gengar_(Pok%C3%A9mon))')).to.be.eql(
      insideDocumentAndParagraph([
        new VideoNode('ghostly howling', 'http://example.com/ghosts.ogg'),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('bulbapedia.bulbagarden.net/wiki/Gengar_(Pok%C3%A9mon)')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Gengar_(Pok%C3%A9mon)'),
          new PlainTextNode(')')          
        ])
      ]))
  })
})
