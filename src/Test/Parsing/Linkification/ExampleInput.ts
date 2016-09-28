import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../Helpers'


describe('An example input convention followed by a parenthesized/bracketd URL', () => {
  it('produces an example input node within a link pointing to the URL', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart } (https://example.com/my-cart) and scroll down.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('To view your shopping cart, press '),
        new Up.Link([
          new Up.ExampleInput('My Cart')
        ], 'https://example.com/my-cart'),
        new Up.Text(' and scroll down.')
      ]))
  })
})


context('Any example input convention followed immediately by a (second) parenthesized/bracketed URL produces an audio node within a link pointing to that second URL.', () => {
  specify('The "linkifying" URL can be enclosed within parentheses or square brackets', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ My Cart }',
      bracketedSegments: [
        { text: 'https://example.com/my-cart' }
      ],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('My Cart')
        ], 'https://example.com/my-cart'),
      ])
    })
  })
})


context("As long as there is no whitespace between the example input and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
  specify('The linkifying URL can start with whitespace', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ My Cart }',
      bracketedSegments: [{
        text: ' \t \t https://example.com/my-cart'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('My Cart')
        ], 'https://example.com/my-cart'),
      ])
    })
  })

  specify('The linkifying URL can contain whitespace', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ My Cart }',
      bracketedSegments: [{
        text: 'https://example.com/my cart'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('My Cart')
        ], 'https://example.com/my cart'),
      ])
    })
  })

  specify('The linkifying URL can start with whitespace, contain whitespace, and not have a URL scheme', () => {
    expectEveryPermutationOfBrackets({
      precededBy: '{ My Cart }',
      bracketedSegments: [{
        text: ' \t \t example.com/my cart'
      }],
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.ExampleInput('My Cart')
        ], 'https://example.com/my cart'),
      ])
    })
  })
})


context('An example input convention is not linkified when it is directly followed by another bracketed convention, including (but not limited to):', () => {
  specify('Inline revealables', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[SPOILER: and then buy me stuff].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('To view your shopping cart, press '),
        new Up.ExampleInput('My Cart'),
        new Up.InlineRevealable([
          new Up.Text('and then buy me stuff')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Highlights', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[highlight: and then buy me stuff].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('To view your shopping cart, press '),
        new Up.ExampleInput('My Cart'),
        new Up.Highlight([
          new Up.Text('and then buy me stuff')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('Section links', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[topic: shopping cart]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('To view your shopping cart, press '),
        new Up.ExampleInput('My Cart'),
        new Up.SectionLink('shopping cart')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "To view your shopping cart, press { My Cart }[^Then buy me stuff!]."

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Then buy me stuff!')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("To view your shopping cart, press "),
          new Up.ExampleInput('My Cart'),
          footnotes[0],
          new Up.Text('.')
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified example input convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('{ Call }(\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.ExampleInput('Call'),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified example input convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the example input convention is not linkified', () => {
    expect(Up.parse('{ Call }( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.ExampleInput('Call'),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})
