import { expect } from 'chai'
import { Up } from '../../../Up'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { SectionLink } from '../../../SyntaxNodes/SectionLink'
import { ExampleInput } from '../../../SyntaxNodes/ExampleInput'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('An example input convention followed by a parenthesized/bracketd URL', () => {
  it('produces an example input node within a link pointing to the URL', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart } (https://example.com/my-cart) and scroll down.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('To view your shopping cart, press '),
        new Link([
          new ExampleInput('My Cart')
        ], 'https://example.com/my-cart'),
        new PlainText(' and scroll down.')
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
        new Link([
          new ExampleInput('My Cart')
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
        new Link([
          new ExampleInput('My Cart')
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
        new Link([
          new ExampleInput('My Cart')
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
        new Link([
          new ExampleInput('My Cart')
        ], 'https://example.com/my cart'),
      ])
    })
  })
})


context('An example input convention is not linkified when it is directly followed by another bracketed convention, including (but not limited to):', () => {
  specify('Inline spoilers', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[SPOILER: and then buy me stuff].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('To view your shopping cart, press '),
        new ExampleInput('My Cart'),
        new InlineSpoiler([
          new PlainText('and then buy me stuff')
        ]),
        new PlainText('.')
      ]))
  })

  specify('Inline NSFW', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[NSFW: and then buy me stuff].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('To view your shopping cart, press '),
        new ExampleInput('My Cart'),
        new InlineNsfw([
          new PlainText('and then buy me stuff')
        ]),
        new PlainText('.')
      ]))
  })

  specify('Inline NSFL', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[NSFL: and then buy me stuff].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('To view your shopping cart, press '),
        new ExampleInput('My Cart'),
        new InlineNsfl([
          new PlainText('and then buy me stuff')
        ]),
        new PlainText('.')
      ]))
  })

  specify('Highlights', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[highlight: and then buy me stuff].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('To view your shopping cart, press '),
        new ExampleInput('My Cart'),
        new Highlight([
          new PlainText('and then buy me stuff')
        ]),
        new PlainText('.')
      ]))
  })

  specify('Section links', () => {
    expect(Up.parse('To view your shopping cart, press { My Cart }[topic: shopping cart]')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('To view your shopping cart, press '),
        new ExampleInput('My Cart'),
        new SectionLink('shopping cart')
      ]))
  })

  specify("Footnotes", () => {
    const markup = "To view your shopping cart, press { My Cart }[^Then buy me stuff!]."

    const footnotes = [
      new Footnote([
        new PlainText('Then buy me stuff!')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("To view your shopping cart, press "),
          new ExampleInput('My Cart'),
          footnotes[0],
          new PlainText('.')
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified example input convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('{ Call }(\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new ExampleInput('Call'),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified example input convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the example input convention is not linkified', () => {
    expect(Up.parse('{ Call }( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new ExampleInput('Call'),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})
