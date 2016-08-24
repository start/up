import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Video } from '../../../SyntaxNodes/Video'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Link } from '../../../SyntaxNodes/Link'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'


describe('A paragraph directly followed by a video on its own line', () => {
  it('produces a pagraph node followed by a video node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[video: spiders crawling out of mouth][http://example.com/spiders.webm]`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("Do not pour the spiders into your sister's cereal.")
        ]),
        new Video('spiders crawling out of mouth', 'http://example.com/spiders.webm'),
      ]))
  })
})


describe('An otherwise-valid video convention with mismatched brackets surrounding its description', () => {
  it('does not produce an video node', () => {
    expect(Up.toDocument('I like [video: ghosts}(http://example.com/ghosts.webm).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like [video: ghosts}'),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com/ghosts.webm')
          ], 'http://example.com/ghosts.webm'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An otherwise-valid video convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a video node', () => {
    expect(Up.toDocument('I like [video: ghosts][http://example.com/ghosts.webm).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[video: ghosts]')
        ]),
        new PlainText('['),
        new Link([
          new PlainText('example.com/ghosts.webm).')
        ], 'http://example.com/ghosts.webm).'),
      ]))
  })
})


context('Unmatched opening parentheses in a video description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.toDocument('[video: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.deep.equal(
      new UpDocument([
        new Video('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.toDocument('([video: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new NormalParenthetical([
            new PlainText('('),
            new Video('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new PlainText(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a video URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[video: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new Footnote([
      new Video('West Virginia exit polling', 'https://example.com/a(normal(url'),
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          footnote
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })
})
