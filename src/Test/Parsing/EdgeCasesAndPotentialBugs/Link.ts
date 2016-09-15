import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


describe('An otherwise-valid link with mismatched brackets surrounding its description', () => {
  it('does not produce a link node', () => {
    expect(Up.parse('I like [this site}(https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like [this site}'),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('stackoverflow.com')
          ], 'https://stackoverflow.com'),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An otherwise-valid link with mismatched brackets surrounding its URL', () => {
  it('does not produce a link node', () => {
    expect(Up.parse('I like [this site][https://stackoverflow.com).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.SquareParenthetical([
          new Up.PlainText('[this site]')
        ]),
        new Up.PlainText('['),
        new Up.Link([
          new Up.PlainText('stackoverflow.com')
        ], 'https://stackoverflow.com'),
        new Up.PlainText(').'),        
      ]))
  })
})


describe('A link produced by square brackets', () => {
  it('can follow square bracketed text', () => {
    expect(Up.parse("I [usually] use [Google][https://google.com]!!")).to.eql(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.SquareParenthetical([
          new Up.PlainText('[usually]')
        ]),
        new Up.PlainText(' use '),
        new Up.Link([
          new Up.PlainText('Google')
        ], 'https://google.com'),
        new Up.PlainText('!!')
      ]))
  })

  it('can be inside square bracketed text', () => {
    expect(Up.parse("[I use [Google][https://google.com]]")).to.eql(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[I use '),
          new Up.Link([
            new Up.PlainText('Google')
          ], 'https://google.com'),
          new Up.PlainText(']')
        ])
      ]))
  })

  it('starts with the final of multiple opening square brackets even when there is just one closing square bracket', () => {
    expect(Up.parse('Go to [this [site][https://stackoverflow.com]!!')).to.eql(
      insideDocumentAndParagraph([
        new Up.PlainText('Go to [this '),
        new Up.Link([
          new Up.PlainText('site')
        ], 'https://stackoverflow.com'),
        new Up.PlainText('!!')
      ]))
  })
})


describe("A link's contents", () => {
  it('can contain inline code containing an unmatched closing bracket', () => {
    expect(Up.parse('I like [`poor_syntax]`][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.Link([
          new Up.InlineCode('poor_syntax]')
        ], 'https://stackoverflow.com'),
        new Up.PlainText('.')
      ]))
  })

  it('can contain an escaped unmatched closing bracket', () => {
    expect(Up.parse('I like [weird brackets\\]][https://stackoverflow.com].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I like '),
        new Up.Link([
          new Up.PlainText('weird brackets]')
        ], 'https://stackoverflow.com'),
        new Up.PlainText('.')
      ]))
  })
})


describe("Unmatched opening parentheses in a link's URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^He won [West Virginia][https://example.com/a(normal(url] easily.)'

    const footnote = new Up.Footnote([
      new Up.PlainText('He won '),
      new Up.Link([
        new Up.PlainText('West Virginia')
      ], 'https://example.com/a(normal(url'),
      new Up.PlainText(' easily.')
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
          new Up.PlainText('[: Do this :]'),
        ]),
        new Up.PlainText('[: smile! Anyway, why is '),
        new Up.Emphasis([
          new Up.PlainText('everyone')
        ]),
        new Up.PlainText(' greeting mother earth?')
      ]))
  })
})


describe("bracketed text followed by a parenthesized URL starting with an open parenthesis (that gets matched at some point before the URL ends)", () => {
  it('produce a link node (whose URL is prefixed by the default scheme)', () => {
    expect(Up.parse('See the [documentation]((parenthetical)operators).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('See the '),
        new Up.Link([
          new Up.PlainText('documentation')
        ], 'https://(parenthetical)operators'),
        new Up.PlainText('.')
      ]))
  })
})



context('Parenthesized text followed by whitespace followed by an empty bracketed convention does not produce a link. Specificaly, parenthesized text can be followed by:', () => {
  specify('Spoilers', () => {
    expect(Up.parse('(I know.) [SPOILER:]')).to.eql(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(I know.)')
        ]),
        new Up.PlainText(' '),
        new Up.SquareParenthetical([
          new Up.PlainText('[SPOILER:]')
        ])
      ]))
  })

  specify('NSFW', () => {
    expect(Up.parse('(I know.) [NSFW:]')).to.eql(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(I know.)')
        ]),
        new Up.PlainText(' '),
        new Up.SquareParenthetical([
          new Up.PlainText('[NSFW:]')
        ])
      ]))
  })

  specify('NSFL', () => {
    expect(Up.parse('(I know.) [NSFL:]')).to.eql(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(I know.)')
        ]),
        new Up.PlainText(' '),
        new Up.SquareParenthetical([
          new Up.PlainText('[NSFL:]')
        ])
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.parse('(I know.) ()')).to.eql(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(I know.)')
        ]),
        new Up.PlainText(' ()')
      ]))
  })

  specify('Square brackets', () => {
    expect(Up.parse('(I know.) []')).to.eql(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText('(I know.)')
        ]),
        new Up.PlainText(' []')
      ]))
  })
})


describe("An almost-link (with whitespace between its content and URL) terminated early due to a space in its URL", () => {
  it('can contain an unclosed square bracket without affecting a link with a square bracketed URL that follows it', () => {
    expect(Up.parse('[sigh] (https://example.com/sad:[ is a strange page) ... [anyway, go here instead] [https://example.com/happy]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[sigh]')
        ]),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com/sad:[')
          ], 'https://example.com/sad:['),
          new Up.PlainText(' is a strange page)')
        ]),
        new Up.PlainText(' … '),
        new Up.Link([
          new Up.PlainText('anyway, go here instead'),
        ], 'https://example.com/happy')
      ]))
  })
})
