import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '.././Helpers'


context('Up offers no real support for self-overlapping. When a convention overlaps itself, the start/end delimiters simply match from innermost to outermost.', () => {
  context('The delimiters of most conventions make self-overlapping impossible. However, the following can self-overlap:', () => {
    specify('Inline revealables', () => {
      expect(Up.parse('This [SPOILER: does (SPOILER: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('This '),
          new Up.InlineRevealable([
            new Up.Text('does '),
            new Up.InlineRevealable([
              new Up.Text('not')
            ]),
            new Up.Text(' make')
          ]),
          new Up.Text(' much sense.')
        ]))
    })

    specify('Links', () => {
      expect(Up.parse('This [does (not][example.org] make)(google.com) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('This '),
          new Up.Link([
            new Up.Text('does '),
            new Up.Link([
              new Up.Text('not')
            ], 'https://example.org'),
            new Up.Text(' make')
          ], 'https://google.com'),
          new Up.Text(' much sense.')
        ]))
    })

    specify('Footnotes', () => {
      const innerFootnote = new Up.Footnote([
        new Up.Text('not')
      ], { referenceNumber: 2 })

      const outerFootnote = new Up.Footnote([
        new Up.Text('does'),
        innerFootnote,
        new Up.Text(' make')
      ], { referenceNumber: 1 })

      expect(Up.parse('This [^ does (^ not] make) much sense.')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text('This'),
            outerFootnote,
            new Up.Text(' much sense.')
          ]),
          new Up.FootnoteBlock([outerFootnote, innerFootnote])
        ]))
    })
  })


  context('This is also true when a convention overlaps multiple instances of itself.', () => {
    context('A convention with continuity priority', () => {
      specify('Two inline revealable conventions overlapping another', () => {
        expect(Up.parse('[SPOILER: This [SPOILER: does (SPOILER: not]] make) much sense.')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineRevealable([
              new Up.Text('This '),
              new Up.InlineRevealable([
                new Up.Text('does '),
                new Up.InlineRevealable([
                  new Up.Text('not')
                ]),
              ]),
              new Up.Text(' make')
            ]),
            new Up.Text(' much sense.')
          ]))
      })

      specify('An inline revealable overlapping two others', () => {
        expect(Up.parse('[SPOILER: This (SPOILER: does (SPOILER: not] make)) much sense.')).to.deep.equal(
          insideDocumentAndParagraph([
            new Up.InlineRevealable([
              new Up.Text('This '),
              new Up.InlineRevealable([
                new Up.Text('does '),
                new Up.InlineRevealable([
                  new Up.Text('not')
                ]),
                new Up.Text(' make')
              ]),
            ]),
            new Up.Text(' much sense.')
          ]))
      })
    })
  })


  context('When a convention overlaps itself, and both instances are overlapped by another convention, things get messy.', () => {
    specify('It technically works, but needless splitting occers.', () => {
      expect(Up.parse('This [SPOILER: truly *does (SPOILER: not] make* much) sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('This '),
          new Up.InlineRevealable([
            new Up.Text('truly '),
            new Up.Emphasis([
              new Up.Text('does ')
            ]),
            new Up.InlineRevealable([
              new Up.Emphasis([
                new Up.Text('not')
              ])
            ]),
            new Up.Emphasis([
              new Up.Text(' make')
            ]),
            new Up.Text(' much')
          ]),
          new Up.Text(' sense.')
        ]))
    })
  })
})
