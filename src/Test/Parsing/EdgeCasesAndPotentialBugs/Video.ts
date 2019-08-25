import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


describe('A paragraph directly followed by a video on its own line', () => {
  it('produces a pagraph node followed by a video node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[video: spiders crawling out of mouth][http://example.com/spiders.webm]`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Do not pour the spiders into your sister's cereal.")
        ]),
        new Up.Video('spiders crawling out of mouth', 'http://example.com/spiders.webm')
      ]))
  })
})


describe('An otherwise-valid video convention with mismatched brackets surrounding its description', () => {
  it('does not produce a video node', () => {
    expect(Up.parse('I like [video: ghosts}(http://example.com/ghosts.webm).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like [video: ghosts}'),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com/ghosts.webm')
          ], 'http://example.com/ghosts.webm'),
          new Up.Text(')')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An otherwise-valid video convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a video node', () => {
    expect(Up.parse('I like [video: ghosts][http://example.com/ghosts.webm).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.SquareParenthetical([
          new Up.Text('[video: ghosts]')
        ]),
        new Up.Text('['),
        new Up.Link([
          new Up.Text('example.com/ghosts.webm).')
        ], 'http://example.com/ghosts.webm).')
      ]))
  })
})


context('Unmatched opening parentheses in a video description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.parse('[video: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.deep.equal(
      new Up.Document([
        new Up.Video('sad :( sad :( sounds', 'http://example.com/sad.ogg')
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.parse('([video: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Video('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new Up.Text(')')
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a video URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[video: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new Up.Footnote([
      new Up.Video('West Virginia exit polling', 'https://example.com/a(normal(url')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })
})
