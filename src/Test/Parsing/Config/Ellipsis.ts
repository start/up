import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'


context('The "ellipsis" config setting', () => {
  const up = new Up({
    ellipsis: '⋯'
  })

  it('replaces consecutive periods in the markup', () => {
    expect(up.toDocument('I agree... to an extent.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I agree⋯ to an extent.')
      ]))
  })

  it('does not replace instances of the default ellipsis character if the default character itself is used in the markup', () => {
    expect(up.toDocument('I agree… to an extent.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I agree… to an extent.')
      ]))
  })

  it('can consist of multiple characters', () => {
    expect(Up.toDocument('I agree... to an extent.', { ellipsis: '. . .' })).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I agree. . . to an extent.')
      ]))
  })
})
