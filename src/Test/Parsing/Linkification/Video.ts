import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../Helpers'


describe('A video convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces a video node within a link pointing to that second URL', () => {
    expect(Up.parse('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'http://example.com/finalbattle'),
        new Up.Text('.')
      ]))
  })
})


describe('Any video convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces a video node within a link pointing to that second URL. The types of brackets surrounding the video description, the video URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: you fight Gary' },
        { text: 'https://example.com/fight.webm' },
        { text: 'http://example.com/final-battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'http://example.com/final-battle')
      ])
    })
  })

  context("As long as there is no whitespace between the video's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('The linkifying URL can start with whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: you fight Gary' },
          { text: 'https://example.com/fight.webm' },
          { text: ' \t \t http://example.com/final battle' }
        ],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('you fight Gary', 'https://example.com/fight.webm')
          ], 'http://example.com/final battle')
        ])
      })
    })

    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: you fight Gary' },
          { text: 'https://example.com/fight.webm' },
          { text: 'http://example.com/final battle' }
        ],
        toProduce: new Up.Document([
          new Up.Link([
            new Up.Video('you fight Gary', 'https://example.com/fight.webm')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })

  specify('The linkifying URL can start with whitespace, contain whitespace, and not have a URL scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: you fight Gary' },
        { text: 'https://example.com/fight.webm' },
        { text: ' \t \t example.com/final battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'https://example.com/final battle')
      ])
    })
  })
})


describe('A video convention directly followed by an inline spoiler', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Video('you fight Gary', 'https://example.com/fight.webm'),
        new Up.InlineSpoiler([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A video directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Video('you fight Gary', 'https://example.com/fight.webm'),
        new Up.InlineNsfw([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A video directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Video('you fight Gary', 'https://example.com/fight.webm'),
        new Up.InlineNsfl([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A video directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(^Or whatever you name him.)"

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("After you beat the Elite Four, "),
          new Up.Video('you fight Gary', 'https://example.com/fight.webm'),
          footnotes[0],
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified video convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[video: phone call](https://example.com/phonecall.webm)(\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Video('phone call', 'https://example.com/phonecall.webm'),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified video's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the video convention is not linkified', () => {
    expect(Up.parse('[video: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Video('phone call', 'https://example.com/phonecall.ogg'),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})
