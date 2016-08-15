import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ParentheticalNode } from '../../../SyntaxNodes/ParentheticalNode'
import { SquareBracketParentheticalNode } from '../../../SyntaxNodes/SquareBracketParentheticalNode'


describe('A paragraph directly followed by a video on its own line', () => {
  it('produces a pagraph node followed by a video node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[video: spiders crawling out of mouth][http://example.com/spiders.webm]`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode("Do not pour the spiders into your sister's cereal.")
        ]),
        new VideoNode('spiders crawling out of mouth', 'http://example.com/spiders.webm'),
      ]))
  })
})


describe('An otherwise-valid video convention with mismatched brackets surrounding its description', () => {
  it('does not produce an video node', () => {
    expect(Up.toDocument('I like [video: ghosts}(http://example.com/ghosts.webm).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like [video: ghosts}'),
        new ParentheticalNode([
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


describe('An otherwise-valid video convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a video node', () => {
    expect(Up.toDocument('I like [video: ghosts][http://example.com/ghosts.webm).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new SquareBracketParentheticalNode([
          new PlainTextNode('[video: ghosts]')
        ]),
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('example.com/ghosts.webm).')
        ], 'http://example.com/ghosts.webm).'),
      ]))
  })
})


context('Unmatched opening parentheses in a video description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.toDocument('[video: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.be.eql(
      new UpDocument([
        new VideoNode('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.toDocument('([video: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new ParentheticalNode([
            new PlainTextNode('('),
            new VideoNode('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new PlainTextNode(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a video URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[video: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new FootnoteNode([
      new VideoNode('West Virginia exit polling', 'https://example.com/a(normal(url'),
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })
})
