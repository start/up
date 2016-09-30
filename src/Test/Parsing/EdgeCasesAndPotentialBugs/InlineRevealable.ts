import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'


describe('An inline revealable convention', () => {
  it('can be the first convention inside another inline revealable convention using same bracket type', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: [SPOILER: Gary] fights you].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.InlineRevealable([
            new Up.Text('Gary')
          ]),
          new Up.Text(' fights you')
        ]),
        new Up.Text('.')
      ]))
  })
})
