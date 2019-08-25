import { expect } from 'chai'
import * as Up from '../../../Main'
import { expectEveryPermutationOfBrackets, insideDocumentAndParagraph } from '../Helpers'


describe('An image convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an image node within a link pointing to that second URL', () => {
    expect(Up.parse('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)(http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Link([
          new Up.Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/finalbattle'),
        new Up.Text('.')
      ]))
  })
})


describe('Any image convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an image node within a link pointing to that second URL. The types of brackets surrounding the image description, the image URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: you fight Gary' },
        { text: 'https://example.com/fight.svg' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/finalbattle')
      ])
    })
  })
})


context("As long as there is no whitespace between the image's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
  specify('The linkifying URL can start with whitespace', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: you fight Gary' },
        { text: 'https://example.com/fight.svg' },
        { text: ' \t \t http://example.com/final-battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/final-battle')
      ])
    })
  })

  specify('The linkifying URL can contain whitespace', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: you fight Gary' },
        { text: 'https://example.com/fight.svg' },
        { text: 'http://example.com/final battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/final battle')
      ])
    })
  })

  specify('The linkifying URL can start with whitespace, contain whitespace, and not have a URL scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: you fight Gary' },
        { text: 'https://example.com/fight.svg' },
        { text: ' \t \t example.com/final battle' }
      ],
      toProduce: new Up.Document([
        new Up.Link([
          new Up.Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'https://example.com/final battle')
      ])
    })
  })
})


describe('An image convention directly followed by an inline revealable', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Image('you fight Gary', 'https://example.com/fight.svg'),
        new Up.InlineRevealable([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An image directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)(^Or whatever you name him.)"

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("After you beat the Elite Four, "),
          new Up.Image('you fight Gary', 'https://example.com/fight.svg'),
          footnotes[0]
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified image convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[image: phone call](https://example.com/phonecall.svg)(\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Image('phone call', 'https://example.com/phonecall.svg'),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ])
      ]))
  })
})


context("When an otherwise-valid linkified image convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the image convention is not linkified', () => {
    expect(Up.parse('[image: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Image('phone call', 'https://example.com/phonecall.ogg'),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})
