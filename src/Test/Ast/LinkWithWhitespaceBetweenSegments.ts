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


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with "http://" or "https://")', () => {
  it('produces a link node', () => {
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


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing whitespace and starting with a scheme other than "http://" or "https://")', () => {
  it('does not produce a link node, because of the whitespace in the URL', () => {
    expect(Up.toAst('[agreed] (https://stackoverflow.com is nice)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[agreed]')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('stackoverflow.com')
          ], 'https://stackoverflow.com'),
          new PlainTextNode(' is nice)')
        ]),
      ]))
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with a scheme other than "http://" or "https://")', () => {
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


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with a slash)', () => {
  it('does not produces a link node', () => {
    expect(Up.toAst('[no] (/some-page)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[no]')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(/some-page)')
        ]),
      ]))
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with a fragment identifier ("#"))', () => {
  it('does not produces a link node', () => {
    expect(Up.toAst('[no] (#some-page)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[no]')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(#some-page)')
        ]),
      ]))
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and not starting with a scheme, a slash, or a fragment identifier)', () => {
  it('does not produces a link node', () => {
    expect(Up.toAst('[no] (really)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[no]')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(really)')
        ]),
      ]))
  })
})