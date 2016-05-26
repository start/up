import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


describe('Bracketed text pointing to a URL', () => {
  it('produce a link node', () => {
    expect(Up.toAst('I like [this site -> https://stackoverflow.com]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})


describe('Parenthesized text pointing to a URL', () => {
  it('produce a link node', () => {
    expect(Up.toAst('I like (this site -> https://stackoverflow.com). I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})


describe('Curly bracketed text pointing to a URL', () => {
  it('produce a link node', () => {
    expect(Up.toAst('I like {this site -> https://stackoverflow.com}. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})


describe("A link's contents", () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like [*this* site -> https://stackoverflow.com].')).to.be.eql(
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
    expect(Up.toAst('[Google is probably not [Bing -> https://bing.com] -> https://google.com].')).to.be.eql(
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
    expect(Up.toAst('[Google is not at https://bing.com -> https://google.com].')).to.be.eql(
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


describe('A link produced by square brackets', () => {
  it('can contain square bracketed text', () => {
    expect(Up.toAst('I like [[only one] site -> https://stackoverflow.com].')).to.be.eql(
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
  it('can contain square bracketed text', () => {
    expect(Up.toAst('I like ((only one) site -> https://stackoverflow.com).')).to.be.eql(
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
    expect(Up.toAst('I like {{faints} this site -> https://stackoverflow.com}.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new ParenthesizedNode([
            new PlainTextNode('faints')
          ]),
          new PlainTextNode(' this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })
})


describe("A link's URLs", () => {
  it('can contain matching unescaped brackets', () => {
    expect(Up.toAst('Here is a [strange URL -> https://google.com/search?q=[hi]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Here is a '),
        new LinkNode([
          new PlainTextNode('strange URL')
        ], 'https://google.com/search?q=[hi]'),
        new PlainTextNode('.')
      ]))
  })

  it('can have an escaped, unmatched closing bracket', () => {
    expect(Up.toAst('I like [this site -> https://google.com/?fake=\\]query]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://google.com/?fake=]query'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})

