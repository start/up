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
import { InlineCode } from '../../../SyntaxNodes/InlineCode'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { InternalTopicLink } from '../../../SyntaxNodes/InternalTopicLink'
import { PlainText } from '../../../SyntaxNodes/PlainText'


// For context, please see: http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016
const lotsOfSpaces = repeat(' ', 10000)


context('A long string of whitespace should never cause cause the parser to hang:', () => {
  specify('Between words', () => {
    expect(Up.parse('Hear' + lotsOfSpaces + 'me?')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hear' + lotsOfSpaces + 'me?')
      ]))
  })


  context('In inline code:', () => {
    specify('As the sole content', () => {
      expect(Up.parse('`' + lotsOfSpaces + '`')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode(lotsOfSpaces)
        ]))
    })

    specify('In the middle of other code', () => {
      expect(Up.parse('`odd' + lotsOfSpaces + 'code`')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('odd' + lotsOfSpaces + 'code')
        ]))
    })

    specify('At the start, directly followed by backticks', () => {
      expect(Up.parse('`' + lotsOfSpaces + '``code`` `')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode(lotsOfSpaces.slice(1) + '``code``')
        ]))
    })

    specify('At the end, directly following backticks', () => {
      expect(Up.parse('` ``code``' + lotsOfSpaces + '`')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineCode('``code``' + lotsOfSpaces.slice(1))
        ]))
    })
  })


  specify("Before a footnote", () => {
    const markup = "I don't eat cereal." + lotsOfSpaces + "(^Well, I do, but I pretend not to.)"

    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  specify('Before an unmatched footnote start delimiter', () => {
    expect(Up.parse('Still typing' + lotsOfSpaces + '[^')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Still typing' + lotsOfSpaces + '[^')
      ]))
  })

  specify("Between an otherwise-valid link's bracketed content and the unmatched open bracket for its URL", () => {
    expect(Up.parse('(Unreasonable)' + lotsOfSpaces + '(https://')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(Unreasonable)')
        ]),
        new PlainText(lotsOfSpaces + '(https://')
      ]))
  })

  specify('Before an unmatched start delimiter from a rich bracketed convention', () => {
    expect(Up.parse('Still typing' + lotsOfSpaces + '[SPOILER:')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Still typing' + lotsOfSpaces + '[SPOILER:')
      ]))
  })

  specify("Between a link's bracketed content and its bracketed URL", () => {
    expect(Up.parse('[Hear me?]' + lotsOfSpaces + '(example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Hear me?')
        ], 'https://example.com')
      ]))
  })

  specify("At the end of a link's content", () => {
    expect(Up.parse('[Hear me?' + lotsOfSpaces + '](example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Hear me?' + lotsOfSpaces)
        ], 'https://example.com')
      ]))
  })


  context("In a link's URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[Hear me?](' + lotsOfSpaces + 'example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('Hear me?')
          ], 'https://example.com')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[Hear me?](example.com' + lotsOfSpaces + ')')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('Hear me?')
          ], 'https://example.com')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[Hear me?](example.com?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        insideDocumentAndParagraph([
          new Link([
            new PlainText('Hear me?')
          ], 'https://example.com?some=ridiculous-' + lotsOfSpaces + '[arg]')
        ]))
    })
  })


  context("In a media convention's description:", () => {
    specify("At the start", () => {
      expect(Up.parse('[image:' + lotsOfSpaces + 'ear](example.com/ear.svg)')).to.deep.equal(
        new UpDocument([
          new Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[image: ear' + lotsOfSpaces + '](example.com/ear.svg)')).to.deep.equal(
        new UpDocument([
          new Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[image: haunted' + lotsOfSpaces + '[house]](http://example.com/?state=NE)')).to.deep.equal(
        new UpDocument([
          new Image('haunted' + lotsOfSpaces + '[house]', 'http://example.com/?state=NE'),
        ]))
    })
  })


  specify("Between a media convention's bracketed description and its bracketed URL", () => {
    expect(Up.parse('[image: ear]' + lotsOfSpaces + '(example.com/ear.svg)')).to.deep.equal(
      new UpDocument([
        new Image('ear', 'https://example.com/ear.svg')
      ]))
  })


  context("In a media convention's URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[image: ear](' + lotsOfSpaces + 'example.com/ear.svg)')).to.deep.equal(
        new UpDocument([
          new Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[image: ear](example.com/ear.svg' + lotsOfSpaces + ')')).to.deep.equal(
        new UpDocument([
          new Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[image: ear](example.com/ear.svg?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        new UpDocument([
          new Image('ear', 'https://example.com/ear.svg?some=ridiculous-' + lotsOfSpaces + '[arg]')
        ]))
    })
  })


  specify("Between a linkified media convention's bracketed URL and its linkifying URL", () => {
    expect(Up.parse('[image: ear] (example.com/ear.svg)' + lotsOfSpaces + '(example.com)')).to.deep.equal(
      new UpDocument([
        new Link([
          new Image('ear', 'https://example.com/ear.svg')
        ], 'https://example.com')
      ]))
  })


  context("In a linkified media convention's linkifying URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[image: ear] (example.com/ear.svg)(' + lotsOfSpaces + 'example.com)')).to.deep.equal(
        new UpDocument([
          new Link([
            new Image('ear', 'https://example.com/ear.svg')
          ], 'https://example.com')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[image: ear] (example.com/ear.svg)(example.com' + lotsOfSpaces + ')')).to.deep.equal(
        new UpDocument([
          new Link([
            new Image('ear', 'https://example.com/ear.svg')
          ], 'https://example.com')
        ]))
    })

    specify("Before an open bracketURL", () => {
      expect(Up.parse('[image: ear] (example.com/ear.svg)(example.com?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        new UpDocument([
          new Link([
            new Image('ear', 'https://example.com/ear.svg')
          ], 'https://example.com?some=ridiculous-' + lotsOfSpaces + '[arg]')
        ]))
    })
  })


  specify("Between a non-media convention's bracketed URL and its linkifying URL", () => {
    expect(Up.parse('[SPOILER: His ear grew back!]' + lotsOfSpaces + '(example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new Link([
            new PlainText('His ear grew back!')
          ], 'https://example.com')
        ])
      ]))
  })


  context("In a non-media convention's linkifying URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[SPOILER: His ear grew back!](' + lotsOfSpaces + 'example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Link([
              new PlainText('His ear grew back!')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[SPOILER: His ear grew back!](example.com' + lotsOfSpaces + ')')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Link([
              new PlainText('His ear grew back!')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("Before a an open bracket", () => {
      expect(Up.parse('[SPOILER: His ear grew back!](example.com?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new Link([
              new PlainText('His ear grew back!')
            ], 'https://example.com?some=ridiculous-' + lotsOfSpaces + '[arg]')
          ])
        ]))
    })
  })


  specify("Between the delimiters of an otherwise-valid convention that cannot be blank", () => {
    expect(Up.parse('(SPOILER:' + lotsOfSpaces + ')')).to.deep.equal(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(SPOILER:' + lotsOfSpaces + ')')
        ])
      ]))
  })


  context('In a rich convention:', () => {
    specify("At the start", () => {
      expect(Up.parse('[SPOILER:' + lotsOfSpaces + 'He did not die.]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('He did not die.')
          ])
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[SPOILER: He did not die.' + lotsOfSpaces + ']')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('He did not die.' + lotsOfSpaces)
          ])
        ]))
    })
  })


  context('In a reference to a table of contents entry', () => {
    specify("At the start", () => {
      expect(Up.parse('[topic:' + lotsOfSpaces + 'He did not die.]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InternalTopicLink('He did not die.')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[topic: He did not die.' + lotsOfSpaces + ']')).to.deep.equal(
        insideDocumentAndParagraph([
          new InternalTopicLink('He did not die.')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[topic: He did not die.' + lotsOfSpaces + '(Really.)]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InternalTopicLink('He did not die.' + lotsOfSpaces + '(Really.)')
        ]))
    })
  })


  specify('On a blank line at the start of a document', () => {
    const markup = lotsOfSpaces + `
This is not reasonable.`

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('On a blank line at the end of a document', () => {
    const markup = `
This is not reasonable.
` + lotsOfSpaces

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the start of a paragraph at the beginning of a document', () => {
    const markup = lotsOfSpaces + 'This is not reasonable.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the end of a paragraph at the end of a document', () => {
    const markup = 'This is not reasonable.' + lotsOfSpaces

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is not reasonable.')
      ]))
  })

  specify('At the start of a paragraph that is not the first convention within a document', () => {
    const markup = lotsOfSpaces + `
This is not reasonable.

${lotsOfSpaces}However, we have to go with it.`

    expect(Up.parse(markup)).to.deep.equal(
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
    const markup = lotsOfSpaces + `
This is not reasonable.${lotsOfSpaces}

However, we have to go with it.`

    expect(Up.parse(markup)).to.deep.equal(
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
    const markup = lotsOfSpaces + `
This is not reasonable.

${lotsOfSpaces}-~-~-~-~-~-`

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('This is not reasonable.')
        ]),
        new ThematicBreak()
      ]))
  })

  specify('At the end of a thematic break streak that is not the last convention within a document', () => {
    const markup = lotsOfSpaces + `
-~-~-~-~-~-~-~-${lotsOfSpaces}

However, we have to go with it.`

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new ThematicBreak(),
        new Paragraph([
          new PlainText('However, we have to go with it.')
        ])
      ]))
  })
})