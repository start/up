import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('A paragraph directly followed by an image on its own line', () => {
  it('produces a pagraph node followed by an image node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[image: sister arraigned on charges][http://example.com/court.jpg]`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Do not pour the spiders into your sister's cereal.")
        ]),
        new Up.Image('sister arraigned on charges', 'http://example.com/court.jpg'),
      ]))
  })
})


describe('An otherwise-valid image convention with mismatched brackets surrounding its description', () => {
  it('does not produce an image node', () => {
    expect(Up.parse('I like [image: ghosts}(http://example.com/ghosts.svg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like [image: ghosts}'),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com/ghosts.svg')
          ], 'http://example.com/ghosts.svg'),
          new Up.Text(')'),
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An otherwise-valid image convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a image node', () => {
    expect(Up.parse('I like [image: ghosts][http://example.com/ghosts.svg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.SquareParenthetical([
          new Up.Text('[image: ghosts]')
        ]),
        new Up.Text('['),
        new Up.Link([
          new Up.Text('example.com/ghosts.svg).')
        ], 'http://example.com/ghosts.svg).'),
      ]))
  })
})


context('Unmatched opening parentheses in an image description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.parse('[image: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.deep.equal(
      new Up.Document([
        new Up.Image('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.parse('([image: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Image('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new Up.Text(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in an image URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[image: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new Up.Footnote([
      new Up.Image('West Virginia exit polling', 'https://example.com/a(normal(url'),
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


describe("A line consistingly solely of a link that contains both an image and regular text", () => {
  it("is placed into a paragraph node", () => {
    expect(Up.parse('[Look: (image: haunted house)(example.com/hauntedhouse.svg)] [example.com]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Look: '),
          new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg')
        ], 'https://example.com')
      ]))
  })
})
