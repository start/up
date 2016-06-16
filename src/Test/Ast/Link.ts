import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets, expectEveryCombinationOf } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


const linkBrackets = [
  { open: '(', close: ')' },
  { open: '[', close: ']' },
  { open: '{', close: '}' }
]


describe('Bracketed text immediately followed by another instance of bracketed text', () => {
  it("produces a link node. The first bracketed text is the link's contents, and the second is the URL. The type of bracket surrounding the text can be different from the type of bracket surrounding the URL", () => {
    expectEveryCombinationOfBrackets({
      brackets: linkBrackets,
      firstPartToWrapInBrackets: 'this site',
      secondPartToWrapInBrackets: 'https://stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com')
      ])
    })
  })
})


describe('Bracketed text immediately followed by another instance of bracketed text with no URL scheme', () => {
  it("produces a link node with its URL prefixed with the default URL scheme ('https://' unless changed via the 'defaultUrlScheme' config setting)", () => {
    expectEveryCombinationOfBrackets({
      brackets: linkBrackets,
      firstPartToWrapInBrackets: 'this site',
      secondPartToWrapInBrackets: 'stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com')
      ])
    })
  })
})


describe('Bracketed text immediately followed by another instance of bracketed text starting with a slash', () => {
  it('produces a link whose URL has no added prefix by default (because the default "baseForUrlsStartingWithSlash" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      brackets: linkBrackets,
      firstPartToWrapInBrackets: 'this site',
      secondPartToWrapInBrackets: '/some-page',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], '/some-page')
      ])
    })
  })
})


describe('Bracketed text immediately followed by another instance of bracketed text starting with a fragment identifier ("#")', () => {
  it('produces a link whose URL has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      brackets: linkBrackets,
      firstPartToWrapInBrackets: 'this site',
      secondPartToWrapInBrackets: '#some-page',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], '#some-page')
      ])
    })
  })
})


describe('Bracketed text immediately followed by another instance of bracketed text with a URL scheme other than "http://" or "https://"', () => {
  it('produces a link whose URL has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      brackets: linkBrackets,
      firstPartToWrapInBrackets: 'email me',
      secondPartToWrapInBrackets: 'mailto:daniel@wants.email',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('email me')
        ], 'mailto:daniel@wants.email')
      ])
    })
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with "http://" or "https://")', () => {
  it('produces a link whose URL has no added prefix by default (because the default "baseForUrlsStartingWithFragmentIdentifier" config setting is blank)', () => {
    expectEveryCombinationOfBrackets({
      brackets: linkBrackets,
      firstPartToWrapInBrackets: 'this site',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: 'https://stackoverflow.com',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com')
      ])
    })
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with anything other than "http://" or "https://")', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('[no] (ftp://example.com)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[no]')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(ftp://example.com)')
        ]),
      ]))
  })
})


describe('Bracketed/parenthesized text followed by a space followed by more bracketed text not starting with "http://" or "https://"', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('[hello] [goodbye]')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[hello]')
        ]),
        new PlainTextNode(' '),
        new SquareBracketedNode([
          new PlainTextNode('[goodbye]')
        ]),
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

