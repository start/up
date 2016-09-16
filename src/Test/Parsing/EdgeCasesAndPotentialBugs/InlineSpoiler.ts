import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('An inline spoiler convention', () => {
  it('can be the first convention inside another spoiler convention using same bracket type', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: [SPOILER: Gary] fights you].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.InlineSpoiler([
            new Up.Text('Gary')
          ]),
          new Up.Text(' fights you')
        ]),
        new Up.Text('.')
      ]))
  })
})
