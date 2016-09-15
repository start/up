import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


describe('A paragraph directly followed by an image on its own line', () => {
  it('produces a pagraph node followed by an image node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[image: sister arraigned on charges][http://example.com/court.jpg]`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("Do not pour the spiders into your sister's cereal.")
        ]),
        new Up.Image('sister arraigned on charges', 'http://example.com/court.jpg'),
      ]))
  })
})


describe('An otherwise-valid image convention with mismatched brackets surrounding its description', () => {
  it('does not produce an image node', () => {
    expect(Up.parse('I like [image: ghosts}(http://example.com/ghosts.svg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like [image: ghosts}'),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com/ghosts.svg')
          ], 'http://example.com/ghosts.svg'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An otherwise-valid image convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a image node', () => {
    expect(Up.parse('I like [image: ghosts][http://example.com/ghosts.svg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('[image: ghosts]')
        ]),
        new Up.PlainText('['),
        new Up.Link([
          new Up.PlainText('example.com/ghosts.svg).')
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
            new Up.PlainText('('),
            new Up.Image('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new Up.PlainText(')'),
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
          new Up.PlainText('Look: '),
          new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg')
        ], 'https://example.com')
      ]))
  })
})
