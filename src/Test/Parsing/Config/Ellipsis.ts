import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'


context('The "ellipsis" settings setting', () => {
  const up = new Up({
    parsing: { ellipsis: '⋯' }
  })

  it('replaces consecutive periods in the markup', () => {
    expect(up.parse('I agree... to an extent.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I agree⋯ to an extent.')
      ]))
  })

  it('does not replace instances of the default ellipsis character if the default character itself is used in the markup', () => {
    expect(up.parse('I agree… to an extent.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I agree… to an extent.')
      ]))
  })

  it('can consist of multiple characters', () => {
    expect(Up.parse('I agree... to an extent.', { ellipsis: '. . .' })).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I agree. . . to an extent.')
      ]))
  })
})
