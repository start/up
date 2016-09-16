import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { repeat } from '../../../StringHelpers'


// For context, please see: http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016
const lotsOfSpaces = repeat(' ', 10000)


context('A long string of whitespace should never cause cause the parser to hang:', () => {
  specify('Between words', () => {
    expect(Up.parse('Hear' + lotsOfSpaces + 'me?')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hear' + lotsOfSpaces + 'me?')
      ]))
  })


  context('In inline code:', () => {
    specify('As the sole content', () => {
      expect(Up.parse('`' + lotsOfSpaces + '`')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode(lotsOfSpaces)
        ]))
    })

    specify('In the middle of other code', () => {
      expect(Up.parse('`odd' + lotsOfSpaces + 'code`')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode('odd' + lotsOfSpaces + 'code')
        ]))
    })

    specify('At the start, directly followed by backticks', () => {
      expect(Up.parse('`' + lotsOfSpaces + '``code`` `')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode(lotsOfSpaces.slice(1) + '``code``')
        ]))
    })

    specify('At the end, directly following backticks', () => {
      expect(Up.parse('` ``code``' + lotsOfSpaces + '`')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineCode('``code``' + lotsOfSpaces.slice(1))
        ]))
    })
  })


  specify("Before a footnote", () => {
    const markup = "I don't eat cereal." + lotsOfSpaces + "(^Well, I do, but I pretend not to.)"

    const footnote = new Up.Footnote([
      new Up.Text('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  specify('Before an unmatched footnote start delimiter', () => {
    expect(Up.parse('Still typing' + lotsOfSpaces + '[^')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Still typing' + lotsOfSpaces + '[^')
      ]))
  })

  specify("Between an otherwise-valid link's bracketed content and the unmatched open bracket for its URL", () => {
    expect(Up.parse('(Unreasonable)' + lotsOfSpaces + '(https://')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Text('(Unreasonable)')
        ]),
        new Up.Text(lotsOfSpaces + '(https://')
      ]))
  })

  specify('Before an unmatched start delimiter from a rich bracketed convention', () => {
    expect(Up.parse('Still typing' + lotsOfSpaces + '[SPOILER:')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Still typing' + lotsOfSpaces + '[SPOILER:')
      ]))
  })

  specify("Between a link's bracketed content and its bracketed URL", () => {
    expect(Up.parse('[Hear me?]' + lotsOfSpaces + '(example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Hear me?')
        ], 'https://example.com')
      ]))
  })

  specify("At the end of a link's content", () => {
    expect(Up.parse('[Hear me?' + lotsOfSpaces + '](example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Hear me?' + lotsOfSpaces)
        ], 'https://example.com')
      ]))
  })


  context("In a link's URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[Hear me?](' + lotsOfSpaces + 'example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Hear me?')
          ], 'https://example.com')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[Hear me?](example.com' + lotsOfSpaces + ')')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Hear me?')
          ], 'https://example.com')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[Hear me?](example.com?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Link([
            new Up.Text('Hear me?')
          ], 'https://example.com?some=ridiculous-' + lotsOfSpaces + '[arg]')
        ]))
    })
  })


  context("In a media convention's description:", () => {
    specify("At the start", () => {
      expect(Up.parse('[image:' + lotsOfSpaces + 'ear](example.com/ear.svg)')).to.deep.equal(
        new Up.Document([
          new Up.Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[image: ear' + lotsOfSpaces + '](example.com/ear.svg)')).to.deep.equal(
        new Up.Document([
          new Up.Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[image: haunted' + lotsOfSpaces + '[house]](http://example.com/?state=NE)')).to.deep.equal(
        new Up.Document([
          new Up.Image('haunted' + lotsOfSpaces + '[house]', 'http://example.com/?state=NE'),
        ]))
    })
  })


  specify("Between a media convention's bracketed description and its bracketed URL", () => {
    expect(Up.parse('[image: ear]' + lotsOfSpaces + '(example.com/ear.svg)')).to.deep.equal(
      new Up.Document([
        new Up.Image('ear', 'https://example.com/ear.svg')
      ]))
  })


  context("In a media convention's URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[image: ear](' + lotsOfSpaces + 'example.com/ear.svg)')).to.deep.equal(
        new Up.Document([
          new Up.Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[image: ear](example.com/ear.svg' + lotsOfSpaces + ')')).to.deep.equal(
        new Up.Document([
          new Up.Image('ear', 'https://example.com/ear.svg')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[image: ear](example.com/ear.svg?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        new Up.Document([
          new Up.Image('ear', 'https://example.com/ear.svg?some=ridiculous-' + lotsOfSpaces + '[arg]')
        ]))
    })
  })


  specify("Between a linkified media convention's bracketed URL and its linkifying URL", () => {
    expect(Up.parse('[image: ear] (example.com/ear.svg)' + lotsOfSpaces + '(example.com)')).to.deep.equal(
      new Up.Document([
        new Up.Link([
          new Up.Image('ear', 'https://example.com/ear.svg')
        ], 'https://example.com')
      ]))
  })


  context("In a linkified media convention's linkifying URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[image: ear] (example.com/ear.svg)(' + lotsOfSpaces + 'example.com)')).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Image('ear', 'https://example.com/ear.svg')
          ], 'https://example.com')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[image: ear] (example.com/ear.svg)(example.com' + lotsOfSpaces + ')')).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Image('ear', 'https://example.com/ear.svg')
          ], 'https://example.com')
        ]))
    })

    specify("Before an open bracketURL", () => {
      expect(Up.parse('[image: ear] (example.com/ear.svg)(example.com?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        new Up.Document([
          new Up.Link([
            new Up.Image('ear', 'https://example.com/ear.svg')
          ], 'https://example.com?some=ridiculous-' + lotsOfSpaces + '[arg]')
        ]))
    })
  })


  specify("Between a non-media convention's bracketed URL and its linkifying URL", () => {
    expect(Up.parse('[SPOILER: His ear grew back!]' + lotsOfSpaces + '(example.com)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.Text('His ear grew back!')
          ], 'https://example.com')
        ])
      ]))
  })


  context("In a non-media convention's linkifying URL:", () => {
    specify("At the start", () => {
      expect(Up.parse('[SPOILER: His ear grew back!](' + lotsOfSpaces + 'example.com)')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Link([
              new Up.Text('His ear grew back!')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[SPOILER: His ear grew back!](example.com' + lotsOfSpaces + ')')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Link([
              new Up.Text('His ear grew back!')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("Before a an open bracket", () => {
      expect(Up.parse('[SPOILER: His ear grew back!](example.com?some=ridiculous-' + lotsOfSpaces + '[arg])')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Link([
              new Up.Text('His ear grew back!')
            ], 'https://example.com?some=ridiculous-' + lotsOfSpaces + '[arg]')
          ])
        ]))
    })
  })


  specify("Between the delimiters of an otherwise-valid convention that cannot be blank", () => {
    expect(Up.parse('(SPOILER:' + lotsOfSpaces + ')')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Text('(SPOILER:' + lotsOfSpaces + ')')
        ])
      ]))
  })


  context('In a rich convention:', () => {
    specify("At the start", () => {
      expect(Up.parse('[SPOILER:' + lotsOfSpaces + 'He did not die.]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Text('He did not die.')
          ])
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[SPOILER: He did not die.' + lotsOfSpaces + ']')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Text('He did not die.' + lotsOfSpaces)
          ])
        ]))
    })
  })


  context('In a section link', () => {
    specify("At the start", () => {
      expect(Up.parse('[topic:' + lotsOfSpaces + 'He did not die.]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SectionLink('He did not die.')
        ]))
    })

    specify("At the end", () => {
      expect(Up.parse('[topic: He did not die.' + lotsOfSpaces + ']')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SectionLink('He did not die.')
        ]))
    })

    specify("Before an open bracket", () => {
      expect(Up.parse('[topic: He did not die.' + lotsOfSpaces + '(Really.)]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.SectionLink('He did not die.' + lotsOfSpaces + '(Really.)')
        ]))
    })
  })


  specify('On a blank line at the start of a document', () => {
    const markup = lotsOfSpaces + `
This is not reasonable.`

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This is not reasonable.')
      ]))
  })

  specify('On a blank line at the end of a document', () => {
    const markup = `
This is not reasonable.
` + lotsOfSpaces

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This is not reasonable.')
      ]))
  })

  specify('At the start of a paragraph at the beginning of a document', () => {
    const markup = lotsOfSpaces + 'This is not reasonable.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This is not reasonable.')
      ]))
  })

  specify('At the end of a paragraph at the end of a document', () => {
    const markup = 'This is not reasonable.' + lotsOfSpaces

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This is not reasonable.')
      ]))
  })

  specify('At the start of a paragraph that is not the first convention within a document', () => {
    const markup = lotsOfSpaces + `
This is not reasonable.


${lotsOfSpaces}However, we have to go with it.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('This is not reasonable.')
        ]),
        new Up.Paragraph([
          new Up.Text('However, we have to go with it.')
        ])
      ]))
  })

  specify('At the end of a paragraph that is not the last convention within a document', () => {
    const markup = lotsOfSpaces + `
This is not reasonable.${lotsOfSpaces}

However, we have to go with it.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('This is not reasonable.')
        ]),
        new Up.Paragraph([
          new Up.Text('However, we have to go with it.')
        ])
      ]))
  })

  specify('At the start of a thematic break streak that is not the first convention within a document', () => {
    const markup = lotsOfSpaces + `
This is not reasonable.


${lotsOfSpaces}-~-~-~-~-~-`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('This is not reasonable.')
        ]),
        new Up.ThematicBreak()
      ]))
  })

  specify('At the end of a thematic break streak that is not the last convention within a document', () => {
    const markup = lotsOfSpaces + `
-~-~-~-~-~-~-~-${lotsOfSpaces}

However, we have to go with it.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text('However, we have to go with it.')
        ])
      ]))
  })
})
