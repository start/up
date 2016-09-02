import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'


describe('An inline spoiler convention', () => {
  it('can be the first convention inside another spoiler convention using same bracket type', () => {
    expect(Up.toDocument('After you beat the Elite Four, [SPOILER: [SPOILER: Gary] fights you].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new InlineSpoiler([
            new PlainText('Gary')
          ]),
          new PlainText(' fights you')
        ]),
        new PlainText('.')
      ]))
  })
})
