import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph, expectEveryCombinationOfBrackets } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with "http://" or "https://")', () => {
  it('produces a link node', () => {
    expectEveryCombinationOfBrackets({
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


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with a URL scheme other than "http://" or "https://")', () => {
  it('produces a link node', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'email me',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: 'mailto:daniel@wants.email',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('email me')
        ], 'mailto:daniel@wants.email')
      ])
    })
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with a slash")', () => {
  it('produces a link node', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'Model 3',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: '/3',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Model 3')
        ], '/3')
      ])
    })
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (starting with a slash and otherwise containing only digits")', () => {
  it('produces a link node', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: '/wiki/chrono-trigger',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Trigger')
        ], '/wiki/chrono-trigger')
      ])
    })
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing no whitespace and starting with a fragment identifier ("#")', () => {
  it('produces a link node', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'Chrono Trigger',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: '#wiki/chrono-trigger',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Trigger')
        ], '#wiki/chrono-trigger')
      ])
    })
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (starting with a fragment identifier ("#") and otherwise containing only digits', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('[sic] (#14)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[sic]')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(#14)')
        ]),
      ])
    )
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing whitespace and starting with "http://" or "https://")', () => {
  it('does not produce a link node', () => {
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
      ])
    )
  })
})


describe('Bracketed text, followed by whitespace, followed by another instance of bracketed text (containing whitespace and starting with a slash)', () => {
  it('does not produce a link node', () => {
    expect(Up.toAst('[yeah] (/r9k/ inspires geniune pity)')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('[yeah]')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('(/r9k/ inspires geniune pity)')
        ]),
      ])
    )
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


describe("A link's URL, when separated from its content by whitespace,", () => {
  it('can itself contain whitespace if each whitespace character is escaped with a backslash ', () => {
    expectEveryCombinationOfBrackets({
      firstPartToWrapInBrackets: 'this search',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      secondPartToWrapInBrackets: 'https://stackoverflow.com/search=see\\ plus\\ plus',
      toProduce: insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('this search')
        ], 'https://stackoverflow.com/search=see plus plus')
      ])
    })
  })
})