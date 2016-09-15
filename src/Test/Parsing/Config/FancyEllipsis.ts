import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context('The "fancyEllipsis" setting', () => {
  const up = new Up.Transformer({
    parsing: { fancyEllipsis: '⋯' }
  })

  it('replaces consecutive periods in the markup', () => {
    expect(up.parse('I agree... to an extent.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I agree⋯ to an extent.')
      ]))
  })

  it('does not replace instances of the default ellipsis character if the default character itself is used in the markup', () => {
    expect(up.parse('I agree… to an extent.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I agree… to an extent.')
      ]))
  })

  it('can consist of multiple characters', () => {
    expect(Up.parse('I agree... to an extent.', { fancyEllipsis: '. . .' })).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I agree. . . to an extent.')
      ]))
  })
})
