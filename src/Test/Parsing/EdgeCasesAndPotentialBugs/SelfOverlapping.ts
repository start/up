import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from'.././Helpers'
import { Document } from'../../../SyntaxNodes/Document'
import { Paragraph } from'../../../SyntaxNodes/Paragraph'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { InlineSpoiler } from'../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfl } from'../../../SyntaxNodes/InlineNsfl'
import { InlineNsfw } from'../../../SyntaxNodes/InlineNsfw'
import { Highlight } from'../../../SyntaxNodes/Highlight'
import { Link } from '../../../SyntaxNodes/Link'
import { Footnote } from'../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from'../../../SyntaxNodes/FootnoteBlock'


context('Up offers no real support for self-overlapping. When a convention overlaps itself, its start/end delimiters simply match from innermost to outermost.', () => {
  specify('This is true for highlights, which have no continuity priority', () => {
    expect(Up.parse('This [highlight: does (highlight: not] make) much sense.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Highlight([
          new PlainText('does '),
          new Highlight([
            new PlainText('not')
          ]),
          new PlainText(' make')
        ]),
        new PlainText(' much sense.')
      ]))
  })


  context('This is true for conventions with continuity priority:', () => {
    specify('Inline spoilers', () => {
      expect(Up.parse('This [SPOILER: does (SPOILER: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new InlineSpoiler([
            new PlainText('does '),
            new InlineSpoiler([
              new PlainText('not')
            ]),
            new PlainText(' make')
          ]),
          new PlainText(' much sense.')
        ]))
    })

    specify('Inline NSFW', () => {
      expect(Up.parse('This [NSFW: does (NSFW: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new InlineNsfw([
            new PlainText('does '),
            new InlineNsfw([
              new PlainText('not')
            ]),
            new PlainText(' make')
          ]),
          new PlainText(' much sense.')
        ]))
    })

    specify('Inline NSFL', () => {
      expect(Up.parse('This [NSFL: does (NSFL: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new InlineNsfl([
            new PlainText('does '),
            new InlineNsfl([
              new PlainText('not')
            ]),
            new PlainText(' make')
          ]),
          new PlainText(' much sense.')
        ]))
    })

    specify('Links', () => {
      expect(Up.parse('This [does (not][example.org] make)(google.com) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new Link([
            new PlainText('does '),
            new Link([
              new PlainText('not')
            ], 'https://example.org'),
            new PlainText(' make')
          ], 'https://google.com'),
          new PlainText(' much sense.')
        ]))
    })

    specify('Footnotes', () => {
      const innerFootnote = new Footnote([
        new PlainText('not')
      ], { referenceNumber: 2 })

      const outerFootnote = new Footnote([
        new PlainText('does'),
        innerFootnote,
        new PlainText(' make')
      ], { referenceNumber: 1 })

      expect(Up.parse('This [^ does (^ not] make) much sense.')).to.deep.equal(
        new Document([
          new Paragraph([
            new PlainText('This'),
            outerFootnote,
            new PlainText(' much sense.')
          ]),
          new FootnoteBlock([outerFootnote, innerFootnote])
        ]))
    })
  })


  context('This is also true when a convention overlaps multiple instances of itself.', () => {
    context('A convention with no continuity priority:', () => {
      specify('Two highlights overlapping another', () => {
        expect(Up.parse('[highlight: This [highlight: does (highlight: not]] make) much sense.')).to.deep.equal(
          insideDocumentAndParagraph([
            new Highlight([
              new PlainText('This '),
              new Highlight([
                new PlainText('does '),
                new Highlight([
                  new PlainText('not')
                ]),
              ]),
              new PlainText(' make')
            ]),
            new PlainText(' much sense.')
          ]))
      })

      specify('A highlight overlapping two others', () => {
        expect(Up.parse('[highlight: This (highlight: does (highlight: not] make)) much sense.')).to.deep.equal(
          insideDocumentAndParagraph([
            new Highlight([
              new PlainText('This '),
              new Highlight([
                new PlainText('does '),
                new Highlight([
                  new PlainText('not')
                ]),
                new PlainText(' make')
              ]),
            ]),
            new PlainText(' much sense.')
          ]))
      })


      context('A convention with continuity priority', () => {
        specify('Two inline spoilers overlapping another', () => {
          expect(Up.parse('[SPOILER: This [SPOILER: does (SPOILER: not]] make) much sense.')).to.deep.equal(
            insideDocumentAndParagraph([
              new InlineSpoiler([
                new PlainText('This '),
                new InlineSpoiler([
                  new PlainText('does '),
                  new InlineSpoiler([
                    new PlainText('not')
                  ]),
                ]),
                new PlainText(' make')
              ]),
              new PlainText(' much sense.')
            ]))
        })

        specify('An inline spoiler overlapping two others', () => {
          expect(Up.parse('[SPOILER: This (SPOILER: does (SPOILER: not] make)) much sense.')).to.deep.equal(
            insideDocumentAndParagraph([
              new InlineSpoiler([
                new PlainText('This '),
                new InlineSpoiler([
                  new PlainText('does '),
                  new InlineSpoiler([
                    new PlainText('not')
                  ]),
                  new PlainText(' make')
                ]),
              ]),
              new PlainText(' much sense.')
            ]))
        })
      })
    })
  })


  context('When a convention overlaps itself, and both instances are overlapped by another convention, things get messy. It technically works, but needless splitting occers.', () => {
    specify('Due to a lack of unique end delimiters among conventions with continuity priority, this monstrosity is only possible when the convention overlapping itself has higher continuity priority than the other one', () => {
      expect(Up.parse('This [SPOILER: truly *does (SPOILER: not] make* much) sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new InlineSpoiler([
            new PlainText('truly '),
            new Emphasis([
              new PlainText('does ')
            ]),
            new InlineSpoiler([
              new Emphasis([
                new PlainText('not')
              ])
            ]),
            new Emphasis([
              new PlainText(' make')
            ]),
            new PlainText(' much')
          ]),
          new PlainText(' sense.')
        ]))
    })
  })
})
