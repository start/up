import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { HighlightNode } from '../../../SyntaxNodes/HighlightNode'


describe('The "highlight" config term', () => {
  const up = new Up({
    terms: { highlight: 'mark' }
  })

  it('is used to indicate highlighted text', () => {
    expect(up.toAst('[mark: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new HighlightNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })

  it('is case-insensitive, even when custom', () => {
    const lowercase = '[mark: Ash fights Gary]'
    const mixedCase = '[mArK: Ash fights Gary]'

    expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
  })

  it('is trimmed', () => {
    const markup = '[mark: Ash fights Gary]'

    expect(Up.toAst(markup, { terms: { highlight: ' \t mark \t ' } })).to.be.eql(
      insideDocumentAndParagraph([
        new HighlightNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })

  it('ignores any regular expression syntax', () => {
    const markup = '[+mark+: Ash fights Gary]'

    expect(Up.toAst(markup, { terms: { highlight: '+mark+' } })).to.be.eql(
      insideDocumentAndParagraph([
        new HighlightNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[paint: Ash fights Gary][mark: Ash fights Gary]'

    expect(Up.toAst(markup, { terms: { highlight: ['mark', 'paint'] } })).to.be.eql(
      insideDocumentAndParagraph([
        new HighlightNode([
          new PlainTextNode('Ash fights Gary')
        ]),
        new HighlightNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })
})
