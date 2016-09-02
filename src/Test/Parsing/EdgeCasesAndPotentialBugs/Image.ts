import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Image } from '../../../SyntaxNodes/Image'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Link } from '../../../SyntaxNodes/Link'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'


describe('A paragraph directly followed by an image on its own line', () => {
  it('produces a pagraph node followed by an image node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[image: sister arraigned on charges][http://example.com/court.jpg]`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("Do not pour the spiders into your sister's cereal.")
        ]),
        new Image('sister arraigned on charges', 'http://example.com/court.jpg'),
      ]))
  })
})


describe('An otherwise-valid image convention with mismatched brackets surrounding its description', () => {
  it('does not produce an image node', () => {
    expect(Up.toDocument('I like [image: ghosts}(http://example.com/ghosts.svg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like [image: ghosts}'),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com/ghosts.svg')
          ], 'http://example.com/ghosts.svg'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An otherwise-valid image convention with mismatched brackets surrounding its URL', () => {
  it('does not produce a image node', () => {
    expect(Up.toDocument('I like [image: ghosts][http://example.com/ghosts.svg).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[image: ghosts]')
        ]),
        new PlainText('['),
        new Link([
          new PlainText('example.com/ghosts.svg).')
        ], 'http://example.com/ghosts.svg).'),
      ]))
  })
})


context('Unmatched opening parentheses in an image description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.toDocument('[image: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.deep.equal(
      new UpDocument([
        new Image('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.toDocument('([image: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new NormalParenthetical([
            new PlainText('('),
            new Image('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new PlainText(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in an image URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[image: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new Footnote([
      new Image('West Virginia exit polling', 'https://example.com/a(normal(url'),
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


describe("A line consistingly solely of a link that contains both an image and regular text", () => {
  it("is placed into a paragraph node", () => {
    expect(Up.toDocument('[Look: (image: haunted house)(example.com/hauntedhouse.svg)] [example.com]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Look: '),
          new Image('haunted house', 'https://example.com/hauntedhouse.svg')
        ], 'https://example.com')
      ]))
  })
})
