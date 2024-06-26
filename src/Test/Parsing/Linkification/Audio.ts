import { expect } from 'chai'
import * as Up from '../../../Main'
import { expectEveryPermutationOfBrackets, insideDocumentAndParagraph } from '../Helpers'


describe('An audio convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an audio node within a link pointing to that second URL', () => {
    expect(Up.parse('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle'),
        new Up.Text('.')
      ]))
  })
})


describe('Any audio convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an audio node within a link pointing to that second URL. The types of brackets surrounding the audio description, the audio URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle')
      ])
    })
  })
})


context("As long as there is no whitespace between the audio's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
  specify('The linkifying URL can start with whitespace, contain whitespace, and not have a URL scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: ' \t \t example.com/final battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'https://example.com/final battle')
      ])
    })
  })

  specify('The linkifying URL can contain whitespace', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: 'http://example.com/final battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/final battle')
      ])
    })
  })

  specify('The linkifying URL can start with whitespace, contain whitespace, and not have a URL scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: ' \t \t example.com/final battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'https://example.com/final battle')
      ])
    })
  })
})


describe('An audio convention directly followed by an inline revealable', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Audio('you fight Gary', 'https://example.com/fight.ogg'),
        new Up.InlineRevealable([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An audio convention directly followed by a footnote', () => {
  it('is not linkified', () => {
    const markup = 'After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(^Or whatever you name him.)'

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('After you beat the Elite Four, '),
          new Up.Audio('you fight Gary', 'https://example.com/fight.ogg'),
          footnotes[0]
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified audio convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[audio: phone call](https://example.com/phonecall.ogg)(\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Audio('phone call', 'https://example.com/phonecall.ogg'),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ])
      ]))
  })
})


context("When an otherwise-valid linkified audio convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the audio convention is not linkified', () => {
    expect(Up.parse('[audio: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Audio('phone call', 'https://example.com/phonecall.ogg'),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})

