import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'


describe('A paragraph directly followed by audio on its own line', () => {
  it('produces a pagraph node followed by an audio node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[audio: six seconds of screaming][http://example.com/screaming.ogg]`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Do not pour the spiders into your sister's cereal.")
        ]),
        new Up.Audio('six seconds of screaming', 'http://example.com/screaming.ogg'),
      ]))
  })
})


describe('An otherwise-valid audio convention with mismatched brackets surrounding its description', () => {
  it('does not produce an audio node', () => {
    expect(Up.parse('I like [audio: ghosts}(http://example.com/ghosts.ogg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like [audio: ghosts}'),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com/ghosts.ogg')
          ], 'http://example.com/ghosts.ogg'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An otherwise-valid audio convention with mismatched brackets surrounding its URL', () => {
  it('does not produce an audio node', () => {
    expect(Up.parse('I like [audio: ghosts][http://example.com/ghosts.ogg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.SquareParenthetical([
          new Up.Text('[audio: ghosts]')
        ]),
        new Up.Text('['),
        new Up.Link([
          new Up.Text('example.com/ghosts.ogg).')
        ], 'http://example.com/ghosts.ogg).'),
      ]))
  })
})


context('Unmatched opening parentheses in an audio description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.parse('[audio: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.deep.equal(
      new Up.Document([
        new Up.Audio('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.parse('([audio: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Audio('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new Up.Text(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in an audio URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[audio: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new Up.Footnote([
      new Up.Audio('West Virginia exit polling', 'https://example.com/a(normal(url'),
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
