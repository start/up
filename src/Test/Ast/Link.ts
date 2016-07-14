import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


describe('Bracketed (square bracketed, curly bracketed, or parenthesized) text, followed immediately by another instance of bracketed text,', () => {
  it("produces a link node. The first bracketed text is treated as the link's contents, and the second is treated as the link's URL", () => {
    expect(Up.toAst('I like [this site](https://stackoverflow.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })
})


describe("The brackets enclosing a link's description and URL", () => {
  it("can be different from each other (as long as each pair of brackets is matching)", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: 'http://stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], 'http://stackoverflow.com')
      ])
    })
  })
})


context("If there's no whitespace between a link's bracketed content and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'this site',
      url: ' \t http://stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], 'http://stackoverflow.com')
      ])
    })
  })
})


describe('An otherwise valid link with its URL escaped', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('[call me](\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[call me]')
        ]),
        new ParenthesizedNode([
          new PlainTextNode('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When a link's URL starts with whitespace, and the first character in the actual URL is escaped", () => {
  specify('it does not produce a link node', () => {
    expect(Up.toAst('[call me]( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[call me]')
        ]),
        new PlainTextNode('( \t tel:5555555555)')
      ]))
  })
})


describe("A link's contents", () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like [*this* site][https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('this')
          ]),
          new PlainTextNode(' site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })

  it('is evaluated for other links', () => {
    expect(Up.toAst('[Google is probably not [Bing][https://bing.com]][https://google.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Google is probably not '),
          new LinkNode([
            new PlainTextNode('Bing')
          ], 'https://bing.com')
        ], 'https://google.com'),
        new PlainTextNode('.')
      ]))
  })

  it('is evaluated for naked URLs', () => {
    expect(Up.toAst('[Google is not at https://bing.com][https://google.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Google is not at '),
          new LinkNode([
            new PlainTextNode('bing.com')
          ], 'https://bing.com')
        ], 'https://google.com'),
        new PlainTextNode('.')
      ]))
  })
})


describe("A link's URL", () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toAst('I like [this site][https://stackoverflow.com/?search=*hello*there].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com/?search=*hello*there'),
        new PlainTextNode('.')
      ]))
  })

  it('can contain spaces (assuming the bracketed URL directly follows the bracketed content)', () => {
    expect(Up.toAst('I like [this site][https://stackoverflow.com/?search=hello there].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com/?search=hello there'),
        new PlainTextNode('.')
      ]))
  })
})


describe('A link produced by square brackets', () => {
  it('can start with square bracketed text', () => {
    expect(Up.toAst('I like [[only one] site][https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new SquareBracketedNode([
            new PlainTextNode('[only one]')
          ]),
          new PlainTextNode(' site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })
})


describe('A link produced by parentheses', () => {
  it('can start with parenthesized text', () => {
    expect(Up.toAst('I like ((only one) site)(https://stackoverflow.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new ParenthesizedNode([
            new PlainTextNode('(only one)')
          ]),
          new PlainTextNode(' site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })
})


describe('A link produced by curly brackets', () => {
  it('can contain action text', () => {
    expect(Up.toAst('I like {{faints} this site}{https://stackoverflow.com}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new ActionNode([
            new PlainTextNode('faints')
          ]),
          new PlainTextNode(' this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })
})


describe("The URL of a link produced by square brackets", () => {
  it('can contain matching unescaped brackets', () => {
    expect(Up.toAst('Here is a [strange URL][https://google.com/search?q=[hi]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Here is a '),
        new LinkNode([
          new PlainTextNode('strange URL')
        ], 'https://google.com/search?q=[hi]'),
        new PlainTextNode('.')
      ]))
  })

  it('can have an escaped, unmatched closing bracket', () => {
    expect(Up.toAst('I like [this site][https://google.com/?fake=\\]query]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://google.com/?fake=]query'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})