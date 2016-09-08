import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { repeat } from '../../../StringHelpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { Image } from '../../../SyntaxNodes/Image'
import { PlainText } from '../../../SyntaxNodes/PlainText'


// For context, please see: http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016

const lotsOfWhitespace = repeat(' ', 2000)

context('A long string of whitespace should never cause cause the parser to hang:', () => {
  specify('Between words', () => {
    expect(Up.parseDocument('Hear' + lotsOfWhitespace + 'me?')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hear' + lotsOfWhitespace + 'me?')
      ]))
  })

  specify("Between a link's bracketed content and its bracketed URL", () => {
    expect(Up.parseDocument('[Hear me?]' + lotsOfWhitespace + '(example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Hear me?')
        ], 'https://example.com')
      ]))
  })

  specify("Between a media convention's bracketed description and its bracketed URL", () => {
    expect(Up.parseDocument('[image: ear]' + lotsOfWhitespace + '(example.com/ear.svg)')).to.deep.equal(
      new UpDocument([
        new Image('ear', 'https://example.com/ear.svg')
      ]))
  })

  specify("Between a linkified media convention's bracketed URL and its linkifying URL", () => {
    expect(Up.parseDocument('[image: ear] (example.com/ear.svg)' + lotsOfWhitespace + '(example.com)')).to.deep.equal(
      new UpDocument([
        new Link([
          new Image('ear', 'https://example.com/ear.svg')
        ], 'https://example.com')
      ]))
  })

  specify("Between a non-media convention's bracketed URL and its linkifying URL", () => {
    expect(Up.parseDocument('[SPOILER: His ear grew back!]' + lotsOfWhitespace + '(example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new Link([
            new PlainText('His ear grew back!')
          ], 'https://example.com')
        ])
      ]))
  })

  specify('On a blank line at the start of a document', () => {
    const markup = lotsOfWhitespace + `
This is not reasonable.`

    expect(Up.parseDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('On a blank line at the start of a document', () => {
    const markup = lotsOfWhitespace + `
This is not reasonable.`

    expect(Up.parseDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the start of a non-blank line at the beginning of a document', () => {
    const markup = lotsOfWhitespace + 'This is not reasonable.'

    expect(Up.parseDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the end of a non-blank line at the end of a document', () => {
    const markup = 'This is not reasonable.' + lotsOfWhitespace

    expect(Up.parseDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the start of a non-blank paragraph that is not the first convention within a document', () => {
    const markup = lotsOfWhitespace + `
This is not reasonable.

${lotsOfWhitespace}However, we have to go with it.`

    expect(Up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('This is not reasonable.')
        ]),
        new Paragraph([
          new PlainText('However, we have to go with it.')
        ])
      ]))
  })
})