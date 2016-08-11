import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { HighlightNode } from '../../../SyntaxNodes/HighlightNode'


describe('The "highlight" config term', () => {
  const up = new Up({
    i18n: {
      terms: { highlight: 'mark' }
    }
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
})
