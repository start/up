import { expect } from 'chai'
import * as Up from '../../Up'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from './Helpers'


describe('Bracketed (square bracketed or parenthesized) text, followed immediately by another instance of bracketed text,', () => {
  it("produces a link node. The first bracketed text is treated as the link's contents, and the second is treated as the link's URL", () => {
    expect(Up.parse('I like [this site](https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.Text('this site')
        ], 'https://stackoverflow.com'),
        new Up.Text('.')
      ]))
  })
})


describe("The brackets enclosing a link's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'http://stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('this site')
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
        new Up.Link([
          new Up.Text('this site')
        ], 'http://stackoverflow.com')
      ])
    })
  })

  specify("the URL can end with whitespace (and that whitespace is trimmed away)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'http://stackoverflow.com \t ',
      toProduce: insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('this site')
        ], 'http://stackoverflow.com')
      ])
    })
  })
})


describe('An otherwise-valid link with its URL escaped', () => {
  it('does not produce a link node', () => {
    expect(Up.parse('[call me](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[call me]')
        ]),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid link's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('it does not produce a link node', () => {
    expect(Up.parse('[call me]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[call me]')
        ]),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})


describe("A link's contents", () => {
  it('is evaluated for other conventions', () => {
    expect(Up.parse('I like [*this* site][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.Emphasis([
            new Up.Text('this')
          ]),
          new Up.Text(' site')
        ], 'https://stackoverflow.com'),
        new Up.Text('.')
      ]))
  })

  it('is evaluated for other links', () => {
    expect(Up.parse('[Google is probably not [Bing][https://bing.com]][https://google.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Google is probably not '),
          new Up.Link([
            new Up.Text('Bing')
          ], 'https://bing.com')
        ], 'https://google.com'),
        new Up.Text('.')
      ]))
  })

  it('is evaluated for bare URLs', () => {
    expect(Up.parse('[Google is not at https://bing.com][https://google.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text('Google is not at '),
          new Up.Link([
            new Up.Text('bing.com')
          ], 'https://bing.com')
        ], 'https://google.com'),
        new Up.Text('.')
      ]))
  })
})


describe("A link's URL", () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.parse('I like [this site][https://stackoverflow.com/?search=*hello*there].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.Text('this site')
        ], 'https://stackoverflow.com/?search=*hello*there'),
        new Up.Text('.')
      ]))
  })

  it('can contain spaces (assuming the bracketed URL directly follows the bracketed content)', () => {
    expect(Up.parse('I like [this site][https://stackoverflow.com/?search=hello there].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.Text('this site')
        ], 'https://stackoverflow.com/?search=hello there'),
        new Up.Text('.')
      ]))
  })
})


describe('A link produced by square brackets', () => {
  it('can start with square bracketed text', () => {
    expect(Up.parse('I like [[only one] site][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.SquareParenthetical([
            new Up.Text('[only one]')
          ]),
          new Up.Text(' site')
        ], 'https://stackoverflow.com'),
        new Up.Text('.')
      ]))
  })
})


describe('A link produced by parentheses', () => {
  it('can start with parenthesized text', () => {
    expect(Up.parse('I like ((only one) site)(https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.NormalParenthetical([
            new Up.Text('(only one)')
          ]),
          new Up.Text(' site')
        ], 'https://stackoverflow.com'),
        new Up.Text('.')
      ]))
  })
})


describe("The URL of a link produced by square brackets", () => {
  it('can contain matching unescaped brackets', () => {
    expect(Up.parse('Here is a [strange URL][https://google.com/search?q=[hi]].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Here is a '),
        new Up.Link([
          new Up.Text('strange URL')
        ], 'https://google.com/search?q=[hi]'),
        new Up.Text('.')
      ]))
  })

  it('can have an escaped, unmatched closing bracket', () => {
    expect(Up.parse('I like [this site][https://google.com/?fake=\\]query]. I bet you do, too.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.Text('this site')
        ], 'https://google.com/?fake=]query'),
        new Up.Text('. I bet you do, too.')
      ]))
  })
})
