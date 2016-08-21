import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Audio } from '../../../SyntaxNodes/Audio'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Link } from '../../../SyntaxNodes/Link'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'


describe('A paragraph directly followed by audio on its own line', () => {
  it('produces a pagraph node followed by an audio node, not a line block', () => {
    const markup = `
Do not pour the spiders into your sister's cereal.
[audio: six seconds of screaming][http://example.com/screaming.ogg]`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("Do not pour the spiders into your sister's cereal.")
        ]),
        new Audio('six seconds of screaming', 'http://example.com/screaming.ogg'),
      ]))
  })
})


describe('An otherwise-valid audio convention with mismatched brackets surrounding its description', () => {
  it('does not produce an audio node', () => {
    expect(Up.toDocument('I like [audio: ghosts}(http://example.com/ghosts.ogg).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like [audio: ghosts}'),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com/ghosts.ogg')
          ], 'http://example.com/ghosts.ogg'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An otherwise-valid audio convention with mismatched brackets surrounding its URL', () => {
  it('does not produce an audio node', () => {
    expect(Up.toDocument('I like [audio: ghosts][http://example.com/ghosts.ogg).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[audio: ghosts]')
        ]),
        new PlainText('['),
        new Link([
          new PlainText('example.com/ghosts.ogg).')
        ], 'http://example.com/ghosts.ogg).'),
      ]))
  })
})


context('Unmatched opening parentheses in an audio description have no affect on', () => {
  specify('parentheses surounding the URL', () => {
    expect(Up.toDocument('[audio: sad :( sad :( sounds](http://example.com/sad.ogg)')).to.be.eql(
      new UpDocument([
        new Audio('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
      ]))
  })

  specify('parentheses that follow the convention', () => {
    expect(Up.toDocument('([audio: sad :( sad :( sounds][http://example.com/sad.ogg])')).to.be.eql(
      new UpDocument([
        new Paragraph([
          new NormalParenthetical([
            new PlainText('('),
            new Audio('sad :( sad :( sounds', 'http://example.com/sad.ogg'),
            new PlainText(')'),
          ])
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in an audio URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^[audio: West Virginia exit polling][https://example.com/a(normal(url])'

    const footnote = new Footnote([
      new Audio('West Virginia exit polling', 'https://example.com/a(normal(url'),
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
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
