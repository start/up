import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'


context('Up offers no real support for self-overlapping. When a convention overlaps itself, its start/end delimiters simply match from innermost to outermost.', () => {
  specify('This is true for highlights, which have no continuity priority', () => {
    expect(Up.parse('This [highlight: does (highlight: not] make) much sense.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Highlight([
          new Up.PlainText('does '),
          new Up.Highlight([
            new Up.PlainText('not')
          ]),
          new Up.PlainText(' make')
        ]),
        new Up.PlainText(' much sense.')
      ]))
  })


  context('This is true for conventions with continuity priority:', () => {
    specify('Inline spoilers', () => {
      expect(Up.parse('This [SPOILER: does (SPOILER: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('This '),
          new Up.InlineSpoiler([
            new Up.PlainText('does '),
            new Up.InlineSpoiler([
              new Up.PlainText('not')
            ]),
            new Up.PlainText(' make')
          ]),
          new Up.PlainText(' much sense.')
        ]))
    })

    specify('Inline NSFW', () => {
      expect(Up.parse('This [NSFW: does (NSFW: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('This '),
          new Up.InlineNsfw([
            new Up.PlainText('does '),
            new Up.InlineNsfw([
              new Up.PlainText('not')
            ]),
            new Up.PlainText(' make')
          ]),
          new Up.PlainText(' much sense.')
        ]))
    })

    specify('Inline NSFL', () => {
      expect(Up.parse('This [NSFL: does (NSFL: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('This '),
          new Up.InlineNsfl([
            new Up.PlainText('does '),
            new Up.InlineNsfl([
              new Up.PlainText('not')
            ]),
            new Up.PlainText(' make')
          ]),
          new Up.PlainText(' much sense.')
        ]))
    })

    specify('Links', () => {
      expect(Up.parse('This [does (not][example.org] make)(google.com) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('This '),
          new Up.Link([
            new Up.PlainText('does '),
            new Up.Link([
              new Up.PlainText('not')
            ], 'https://example.org'),
            new Up.PlainText(' make')
          ], 'https://google.com'),
          new Up.PlainText(' much sense.')
        ]))
    })

    specify('Footnotes', () => {
      const innerFootnote = new Up.Footnote([
        new Up.PlainText('not')
      ], { referenceNumber: 2 })

      const outerFootnote = new Up.Footnote([
        new Up.PlainText('does'),
        innerFootnote,
        new Up.PlainText(' make')
      ], { referenceNumber: 1 })

      expect(Up.parse('This [^ does (^ not] make) much sense.')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.PlainText('This'),
            outerFootnote,
            new Up.PlainText(' much sense.')
          ]),
          new Up.FootnoteBlock([outerFootnote, innerFootnote])
        ]))
    })
  })


  context('This is also true when a convention overlaps multiple instances of itself.', () => {
    context('A convention with no continuity priority:', () => {
      specify('Two highlights overlapping another', () => {
        expect(Up.parse('[highlight: This [highlight: does (highlight: not]] make) much sense.')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Highlight([
              new Up.PlainText('This '),
              new Up.Highlight([
                new Up.PlainText('does '),
                new Up.Highlight([
                  new Up.PlainText('not')
                ]),
              ]),
              new Up.PlainText(' make')
            ]),
            new Up.PlainText(' much sense.')
          ]))
      })

      specify('A highlight overlapping two others', () => {
        expect(Up.parse('[highlight: This (highlight: does (highlight: not] make)) much sense.')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.Highlight([
              new Up.PlainText('This '),
              new Up.Highlight([
                new Up.PlainText('does '),
                new Up.Highlight([
                  new Up.PlainText('not')
                ]),
                new Up.PlainText(' make')
              ]),
            ]),
            new Up.PlainText(' much sense.')
          ]))
      })


      context('A convention with continuity priority', () => {
        specify('Two inline spoilers overlapping another', () => {
          expect(Up.parse('[SPOILER: This [SPOILER: does (SPOILER: not]] make) much sense.')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.InlineSpoiler([
                new Up.PlainText('This '),
                new Up.InlineSpoiler([
                  new Up.PlainText('does '),
                  new Up.InlineSpoiler([
                    new Up.PlainText('not')
                  ]),
                ]),
                new Up.PlainText(' make')
              ]),
              new Up.PlainText(' much sense.')
            ]))
        })

        specify('An inline spoiler overlapping two others', () => {
          expect(Up.parse('[SPOILER: This (SPOILER: does (SPOILER: not] make)) much sense.')).to.deep.equal(
            insideDocumentAndParagraph([
              new Up.InlineSpoiler([
                new Up.PlainText('This '),
                new Up.InlineSpoiler([
                  new Up.PlainText('does '),
                  new Up.InlineSpoiler([
                    new Up.PlainText('not')
                  ]),
                  new Up.PlainText(' make')
                ]),
              ]),
              new Up.PlainText(' much sense.')
            ]))
        })
      })
    })
  })


  context('When a convention overlaps itself, and both instances are overlapped by another convention, things get messy. It technically works, but needless splitting occers.', () => {
    specify('Due to a lack of unique end delimiters among conventions with continuity priority, this monstrosity is only possible when the convention overlapping itself has higher continuity priority than the other one', () => {
      expect(Up.parse('This [SPOILER: truly *does (SPOILER: not] make* much) sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('This '),
          new Up.InlineSpoiler([
            new Up.PlainText('truly '),
            new Up.Emphasis([
              new Up.PlainText('does ')
            ]),
            new Up.InlineSpoiler([
              new Up.Emphasis([
                new Up.PlainText('not')
              ])
            ]),
            new Up.Emphasis([
              new Up.PlainText(' make')
            ]),
            new Up.PlainText(' much')
          ]),
          new Up.PlainText(' sense.')
        ]))
    })
  })
})
