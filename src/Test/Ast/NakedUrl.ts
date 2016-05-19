import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'


describe('A naked URL', () => {
  it('produces a link node. The content of the link is the URL minus its protocol', () => {
    expect(Up.toAst('https://archive.org')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org')
        ], 'https://archive.org')
      ]))
  })

  it('is terminated by a space', () => {
    expect(Up.toAst('https://archive.org is exciting')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org')
        ], 'https://archive.org'),
        new PlainTextNode(' is exciting')
      ]))
  })

  it('can contain escaped spaces', () => {
    expect(Up.toAst('https://archive.org/fake\\ url')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake url')
        ], 'https://archive.org/fake url')
      ]))
  })

  it('can contain matching parentheses', () => {
    expect(Up.toAst('https://archive.org/fake(url)')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake(url)')
        ], 'https://archive.org/fake(url)')
      ]))
  })

  it('can contain matching square brackets', () => {
    expect(Up.toAst('https://archive.org/fake[url]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake[url]')
        ], 'https://archive.org/fake[url]')
      ]))
  })

  it('can be inside parentheses', () => {
    expect(Up.toAst('(https://archive.org/fake)')).to.be.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainTextNode(')')
        ])
      ]))
  })

  it('can be inside square brackets', () => {
    expect(Up.toAst('[https://archive.org/fake]')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('['),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainTextNode(']'),
        ])
      ]))
  })

  it("can be inside a link", () => {
    expect(Up.toAst('[https://inner.example.com/fake -> https://outer.example.com/real]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new LinkNode([
            new PlainTextNode('inner.example.com/fake')
          ], 'https://inner.example.com/fake')
        ], 'https://outer.example.com/real')
      ]))
  })

  it("can be directly inside another inline convention", () => {
    expect(Up.toAst('*https://archive.org/fake*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake'),
        ])
      ]))
  })

  it("can contain unescaped asterisks if not inside an emphasis convention", () => {
    expect(Up.toAst('https://example.org/a*normal*url')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('example.org/a*normal*url')
        ], 'https://example.org/a*normal*url')
      ]))
  })
})
