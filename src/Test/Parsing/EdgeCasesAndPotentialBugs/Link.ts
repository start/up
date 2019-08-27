import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


describe('An otherwise-valid link with mismatched brackets surrounding its description', () => {
  it('does not produce a link node', () => {
    expect(Up.parse('I like [this site}(https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like [this site}'),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('stackoverflow.com')
          ], 'https://stackoverflow.com'),
          new Up.Text(')')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An otherwise-valid link with mismatched brackets surrounding its URL', () => {
  it('does not produce a link node', () => {
    expect(Up.parse('I like [this site][https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.SquareParenthetical([
          new Up.Text('[this site]')
        ]),
        new Up.Text('['),
        new Up.Link([
          new Up.Text('stackoverflow.com')
        ], 'https://stackoverflow.com'),
        new Up.Text(').')
      ]))
  })
})


describe('A link produced by square brackets', () => {
  it('can follow square bracketed text', () => {
    expect(Up.parse('I [usually] use [Google][https://google.com]!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.SquareParenthetical([
          new Up.Text('[usually]')
        ]),
        new Up.Text(' use '),
        new Up.Link([
          new Up.Text('Google')
        ], 'https://google.com'),
        new Up.Text('!!')
      ]))
  })

  it('can be inside square bracketed text', () => {
    expect(Up.parse('[I use [Google][https://google.com]]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[I use '),
          new Up.Link([
            new Up.Text('Google')
          ], 'https://google.com'),
          new Up.Text(']')
        ])
      ]))
  })

  it('starts with the final of multiple opening square brackets even when there is just one closing square bracket', () => {
    expect(Up.parse('Go to [this [site][https://stackoverflow.com]!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Go to [this '),
        new Up.Link([
          new Up.Text('site')
        ], 'https://stackoverflow.com'),
        new Up.Text('!!')
      ]))
  })
})


describe("A link's contents", () => {
  it('can contain inline code containing an unmatched closing bracket', () => {
    expect(Up.parse('I like [`poor_syntax]`][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.InlineCode('poor_syntax]')
        ], 'https://stackoverflow.com'),
        new Up.Text('.')
      ]))
  })

  it('can contain an escaped unmatched closing bracket', () => {
    expect(Up.parse('I like [weird brackets\\]][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I like '),
        new Up.Link([
          new Up.Text('weird brackets]')
        ], 'https://stackoverflow.com'),
        new Up.Text('.')
      ]))
  })
})


describe("Unmatched opening parentheses in a link's URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^He won [West Virginia][https://example.com/a(normal(url] easily.)'

    const footnote = new Up.Footnote([
      new Up.Text('He won '),
      new Up.Link([
        new Up.Text('West Virginia')
      ], 'https://example.com/a(normal(url'),
      new Up.Text(' easily.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe('A link missing its final closing bracket', () => {
  it('does not produce a link node and does not prevent conventions from being evaluated afterward', () => {
    expect(Up.parse('[: Do this :][: smile! Anyway, why is *everyone* greeting mother earth?')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[: Do this :]')
        ]),
        new Up.Text('[: smile! Anyway, why is '),
        new Up.Emphasis([
          new Up.Text('everyone')
        ]),
        new Up.Text(' greeting mother earth?')
      ]))
  })
})


describe('An almost-link (with whitespace between its content and URL) terminated early due to a space in its URL', () => {
  it('can contain an unclosed square bracket without affecting a link with a square bracketed URL that follows it', () => {
    expect(Up.parse('[sigh] (https://example.com/sad:[ is a strange page) ... [anyway, go here instead] [https://example.com/happy]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[sigh]')
        ]),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com/sad:[')
          ], 'https://example.com/sad:['),
          new Up.Text(' is a strange page)')
        ]),
        new Up.Text(' … '),
        new Up.Link([
          new Up.Text('anyway, go here instead')
        ], 'https://example.com/happy')
      ]))
  })
})
