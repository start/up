import { expect } from 'chai'
import * as Up from '../../Up'
import { insideDocumentAndParagraph } from './Helpers'


context('Text enclosed within 2 or more equal signs is highlighted. For example:', () => {
  specify('2 equal signs', () => {
    expect(Up.parse('After you beat the Elite Four, ==you fight Gary==.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('3 equal signs', () => {
    expect(Up.parse('After you beat the Elite Four, ===you fight Gary===.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })

  specify('4 equal signs', () => {
    expect(Up.parse('After you beat the Elite Four, ====you fight Gary====.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Highlighted text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('==You should always use `<font>` elements.==')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Text('You should always use '),
          new Up.InlineCode('<font>'),
          new Up.Text(' elements.'),
        ]),
      ]))
  })

  it('can contain nested highlighted text', () => {
    expect(Up.parse('Yeah, I agree. ==Everyone should eat ==expensive== cereal.==')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah, I agree. '),
        new Up.Highlight([
          new Up.Text('Everyone should eat '),
          new Up.Highlight([
            new Up.Text('expensive')
          ]),
          new Up.Text(' cereal.')
        ])
      ]))
  })
})
