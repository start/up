import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { repeat } from '../../../StringHelpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { Image } from '../../../SyntaxNodes/Image'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { PlainText } from '../../../SyntaxNodes/PlainText'


// For context, please see: http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016

const lotsOfWhitespace = repeat(' ', 5000)

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

  specify("At the end of a link's content", () => {
    expect(Up.parseDocument('[Hear me?' + lotsOfWhitespace + '](example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Hear me?' + lotsOfWhitespace)
        ], 'https://example.com')
      ]))
  })

  specify("At the beginning of a link's URL", () => {
    expect(Up.parseDocument('[Hear me?](' + lotsOfWhitespace + 'example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Hear me?')
        ], 'https://example.com')
      ]))
  })

  specify("At the end a link's URL", () => {
    expect(Up.parseDocument('[Hear me?](example.com' + lotsOfWhitespace + ')')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Hear me?')
        ], 'https://example.com')
      ]))
  })

  specify("At the end of a media convention's description", () => {
    expect(Up.parseDocument('[image: ear' + lotsOfWhitespace + '](example.com/ear.svg)')).to.deep.equal(
      new UpDocument([
        new Image('ear', 'https://example.com/ear.svg')
      ]))
  })

  specify("Between a media convention's bracketed description and its bracketed URL", () => {
    expect(Up.parseDocument('[image: ear]' + lotsOfWhitespace + '(example.com/ear.svg)')).to.deep.equal(
      new UpDocument([
        new Image('ear', 'https://example.com/ear.svg')
      ]))
  })

  specify("At the start of a media convention's URL", () => {
    expect(Up.parseDocument('[image: ear](' + lotsOfWhitespace + 'example.com/ear.svg)')).to.deep.equal(
      new UpDocument([
        new Image('ear', 'https://example.com/ear.svg')
      ]))
  })

  specify("At the end of a media convention's URL", () => {
    expect(Up.parseDocument('[image: ear](example.com/ear.svg' + lotsOfWhitespace + ')')).to.deep.equal(
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

  specify("At the start of a linkified media convention's linkifying URL", () => {
    expect(Up.parseDocument('[image: ear] (example.com/ear.svg)(' + lotsOfWhitespace + 'example.com)')).to.deep.equal(
      new UpDocument([
        new Link([
          new Image('ear', 'https://example.com/ear.svg')
        ], 'https://example.com')
      ]))
  })

  specify("At the end of a linkified media convention's linkifying URL", () => {
    expect(Up.parseDocument('[image: ear] (example.com/ear.svg)(example.com' + lotsOfWhitespace + ')')).to.deep.equal(
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

  specify("At the start of a non-media convention's linkifying URL", () => {
    expect(Up.parseDocument('[SPOILER: His ear grew back!](' + lotsOfWhitespace + 'example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new Link([
            new PlainText('His ear grew back!')
          ], 'https://example.com')
        ])
      ]))
  })

  specify("At the end of a non-media convention's linkifying URL", () => {
    expect(Up.parseDocument('[SPOILER: His ear grew back!](example.com' + lotsOfWhitespace + ')')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new Link([
            new PlainText('His ear grew back!')
          ], 'https://example.com')
        ])
      ]))
  })

  specify("Between the delimiters of an otherwise-valid convention that cannot be blank", () => {
    expect(Up.parseDocument('(SPOILER:' + lotsOfWhitespace + ')')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(SPOILER:' + lotsOfWhitespace + ')')
        ])
      ]))
  })

  specify("At the start of a rich convention", () => {
    expect(Up.parseDocument('[SPOILER:' + lotsOfWhitespace + 'He did not die.]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('He did not die.')
        ])
      ]))
  })

  specify("At the end of a rich convention", () => {
    expect(Up.parseDocument('[SPOILER: He did not die.' + lotsOfWhitespace + ']')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('He did not die.' + lotsOfWhitespace)
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

  specify('On a blank line at the end of a document', () => {
    const markup = `
This is not reasonable.
` + lotsOfWhitespace

    expect(Up.parseDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the start of a paragraph at the beginning of a document', () => {
    const markup = lotsOfWhitespace + 'This is not reasonable.'

    expect(Up.parseDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the end of a paragraph at the end of a document', () => {
    const markup = 'This is not reasonable.' + lotsOfWhitespace

    expect(Up.parseDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the start of a paragraph that is not the first convention within a document', () => {
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

  specify('At the end of a paragraph that is not the last convention within a document', () => {
    const markup = lotsOfWhitespace + `
This is not reasonable.${lotsOfWhitespace}

However, we have to go with it.`

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

  specify('At the start of a thematic break streak that is not the first convention within a document', () => {
    const markup = lotsOfWhitespace + `
This is not reasonable.

${lotsOfWhitespace}-~-~-~-~-~-`

    expect(Up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('This is not reasonable.')
        ]),
        new ThematicBreak()
      ]))
  })

  specify('At the end of a thematic break streak that is not the last convention within a document', () => {
    const markup = lotsOfWhitespace + `
-~-~-~-~-~-~-~-${lotsOfWhitespace}

However, we have to go with it.`

    expect(Up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new ThematicBreak(),
        new Paragraph([
          new PlainText('However, we have to go with it.')
        ])
      ]))
  })
})