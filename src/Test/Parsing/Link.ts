import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from './Helpers'
import { Link } from '../../SyntaxNodes/Link'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'


describe('Bracketed (square bracketed or parenthesized) text, followed immediately by another instance of bracketed text,', () => {
  it("produces a link node. The first bracketed text is treated as the link's contents, and the second is treated as the link's URL", () => {
    expect(Up.toDocument('I like [this site](https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new PlainText('this site')
        ], 'https://stackoverflow.com'),
        new PlainText('.')
      ]))
  })
})


describe("The brackets enclosing a link's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'http://stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new Link([
          new PlainText('this site')
        ], 'http://stackoverflow.com')
      ])
    })
  })
})


context("If there's no whitespace between a link's bracketed content and its bracketed URL", () => {
  specify("the URL can start with whitespace (and that whitespace is trimmed away)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: ' \t http://stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new Link([
          new PlainText('this site')
        ], 'http://stackoverflow.com')
      ])
    })
  })

  specify("the URL can end with whitespace (and that whitespace is trimmed away)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'http://stackoverflow.com \t ',
      toProduce: insideDocumentAndParagraph([
        new Link([
          new PlainText('this site')
        ], 'http://stackoverflow.com')
      ])
    })
  })
})


describe('An otherwise-valid link with its URL escaped', () => {
  it('does not produce a link node', () => {
    expect(Up.toDocument('[call me](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[call me]')
        ]),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid link's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('it does not produce a link node', () => {
    expect(Up.toDocument('[call me]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[call me]')
        ]),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})


describe("A link's contents", () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('I like [*this* site][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new Emphasis([
            new PlainText('this')
          ]),
          new PlainText(' site')
        ], 'https://stackoverflow.com'),
        new PlainText('.')
      ]))
  })

  it('is evaluated for other links', () => {
    expect(Up.toDocument('[Google is probably not [Bing][https://bing.com]][https://google.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Google is probably not '),
          new Link([
            new PlainText('Bing')
          ], 'https://bing.com')
        ], 'https://google.com'),
        new PlainText('.')
      ]))
  })

  it('is evaluated for naked URLs', () => {
    expect(Up.toDocument('[Google is not at https://bing.com][https://google.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Google is not at '),
          new Link([
            new PlainText('bing.com')
          ], 'https://bing.com')
        ], 'https://google.com'),
        new PlainText('.')
      ]))
  })
})


describe("A link's URL", () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toDocument('I like [this site][https://stackoverflow.com/?search=*hello*there].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new PlainText('this site')
        ], 'https://stackoverflow.com/?search=*hello*there'),
        new PlainText('.')
      ]))
  })

  it('can contain spaces (assuming the bracketed URL directly follows the bracketed content)', () => {
    expect(Up.toDocument('I like [this site][https://stackoverflow.com/?search=hello there].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new PlainText('this site')
        ], 'https://stackoverflow.com/?search=hello there'),
        new PlainText('.')
      ]))
  })
})


describe('A link produced by square brackets', () => {
  it('can start with square bracketed text', () => {
    expect(Up.toDocument('I like [[only one] site][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new SquareParenthetical([
            new PlainText('[only one]')
          ]),
          new PlainText(' site')
        ], 'https://stackoverflow.com'),
        new PlainText('.')
      ]))
  })
})


describe('A link produced by parentheses', () => {
  it('can start with parenthesized text', () => {
    expect(Up.toDocument('I like ((only one) site)(https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new NormalParenthetical([
            new PlainText('(only one)')
          ]),
          new PlainText(' site')
        ], 'https://stackoverflow.com'),
        new PlainText('.')
      ]))
  })
})


describe("The URL of a link produced by square brackets", () => {
  it('can contain matching unescaped brackets', () => {
    expect(Up.toDocument('Here is a [strange URL][https://google.com/search?q=[hi]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Here is a '),
        new Link([
          new PlainText('strange URL')
        ], 'https://google.com/search?q=[hi]'),
        new PlainText('.')
      ]))
  })

  it('can have an escaped, unmatched closing bracket', () => {
    expect(Up.toDocument('I like [this site][https://google.com/?fake=\\]query]. I bet you do, too.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new PlainText('this site')
        ], 'https://google.com/?fake=]query'),
        new PlainText('. I bet you do, too.')
      ]))
  })
})
