import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { Link } from '../../../SyntaxNodes/Link'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'


describe('An otherwise-valid link with mismatched brackets surrounding its description', () => {
  it('does not produce a link node', () => {
    expect(Up.toDocument('I like [this site}(https://stackoverflow.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like [this site}'),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('stackoverflow.com')
          ], 'https://stackoverflow.com'),
          new PlainText(')'),
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An otherwise-valid link with mismatched brackets surrounding its URL', () => {
  it('does not produce a link node', () => {
    expect(Up.toDocument('I like [this site][https://stackoverflow.com).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new SquareParenthetical([
          new PlainText('[this site]')
        ]),
        new PlainText('['),
        new Link([
          new PlainText('stackoverflow.com).')
        ], 'https://stackoverflow.com).'),
      ]))
  })
})


describe('A link produced by square brackets', () => {
  it('can follow square bracketed text', () => {
    expect(Up.toDocument("I [usually] use [Google][https://google.com]!!")).to.eql(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new SquareParenthetical([
          new PlainText('[usually]')
        ]),
        new PlainText(' use '),
        new Link([
          new PlainText('Google')
        ], 'https://google.com'),
        new PlainText('!!')
      ]))
  })

  it('can be inside square bracketed text', () => {
    expect(Up.toDocument("[I use [Google][https://google.com]]")).to.eql(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[I use '),
          new Link([
            new PlainText('Google')
          ], 'https://google.com'),
          new PlainText(']')
        ])
      ]))
  })

  it('starts with the final of multiple opening square brackets even when there is just one closing square bracket', () => {
    expect(Up.toDocument('Go to [this [site][https://stackoverflow.com]!!')).to.eql(
      insideDocumentAndParagraph([
        new PlainText('Go to [this '),
        new Link([
          new PlainText('site')
        ], 'https://stackoverflow.com'),
        new PlainText('!!')
      ]))
  })
})


describe("A link's contents", () => {
  it('can contain inline code containing an unmatched closing bracket', () => {
    expect(Up.toDocument('I like [`poor_syntax]`][https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new InlineCode('poor_syntax]')
        ], 'https://stackoverflow.com'),
        new PlainText('.')
      ]))
  })

  it('can contain an escaped unmatched closing bracket', () => {
    expect(Up.toDocument('I like [weird brackets\\]][https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new Link([
          new PlainText('weird brackets]')
        ], 'https://stackoverflow.com'),
        new PlainText('.')
      ]))
  })
})


describe("Unmatched opening parentheses in a link's URL", () => {
  it('do not affect any markup that follows the link', () => {
    const markup = '(^He won [West Virginia][https://example.com/a(normal(url] easily.)'

    const footnote = new Footnote([
      new PlainText('He won '),
      new Link([
        new PlainText('West Virginia')
      ], 'https://example.com/a(normal(url'),
      new PlainText(' easily.')
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          footnote
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe('A link missing its final closing bracket', () => {
  it('does not produce a link node and does not prevent conventions from being evaluated afterward', () => {
    expect(Up.toDocument('[: Do this :][: smile! Anyway, why is *everyone* greeting mother earth?')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[: Do this :]'),
        ]),
        new PlainText('[: smile! Anyway, why is '),
        new Emphasis([
          new PlainText('everyone')
        ]),
        new PlainText(' greeting mother earth?')
      ]))
  })
})


describe("bracketed text followed by a parenthesized URL starting with an open parenthesis (that gets matched at some point before the URL ends)", () => {
  it('produce a link node (whose URL is prefixed by the default scheme)', () => {
    expect(Up.toDocument('See the [documentation]((parenthetical)operators).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('See the '),
        new Link([
          new PlainText('documentation')
        ], 'https://(parenthetical)operators'),
        new PlainText('.')
      ]))
  })
})



context('Parenthesized text followed by whitespace followed by an empty bracketed convention does not produce a link. Specificaly, parenthesized text can be followed by:', () => {
  specify('Spoilers', () => {
    expect(Up.toDocument('(I know.) [SPOILER:]')).to.eql(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(I know.)')
        ]),
        new PlainText(' '),
        new SquareParenthetical([
          new PlainText('[SPOILER:]')
        ])
      ]))
  })

  specify('NSFW', () => {
    expect(Up.toDocument('(I know.) [NSFW:]')).to.eql(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(I know.)')
        ]),
        new PlainText(' '),
        new SquareParenthetical([
          new PlainText('[NSFW:]')
        ])
      ]))
  })

  specify('NSFL', () => {
    expect(Up.toDocument('(I know.) [NSFL:]')).to.eql(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(I know.)')
        ]),
        new PlainText(' '),
        new SquareParenthetical([
          new PlainText('[NSFL:]')
        ])
      ]))
  })

  specify('Parentheses', () => {
    expect(Up.toDocument('(I know.) ()')).to.eql(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(I know.)')
        ]),
        new PlainText(' ()')
      ]))
  })

  specify('Square brackets', () => {
    expect(Up.toDocument('(I know.) []')).to.eql(
      insideDocumentAndParagraph([
        new NormalParenthetical([
          new PlainText('(I know.)')
        ]),
        new PlainText(' []')
      ]))
  })
})


describe("An almost-link (with whitespace between its content and URL) terminated early due to a space in its URL", () => {
  it('can contain an unclosed square bracket without affecting a link with a square bracketed URL that follows it', () => {
    expect(Up.toDocument('[sigh] (https://example.com/sad:[ is a strange page) ... [anyway, go here instead] [https://example.com/happy]')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[sigh]')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com/sad:[')
          ], 'https://example.com/sad:['),
          new PlainText(' is a strange page)')
        ]),
        new PlainText(' ... '),
        new Link([
          new PlainText('anyway, go here instead'),
        ], 'https://example.com/happy')
      ]))
  })
})
