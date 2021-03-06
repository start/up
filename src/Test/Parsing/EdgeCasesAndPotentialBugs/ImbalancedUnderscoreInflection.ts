import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Text surrounded by 2 underscores to its left and 1 underscore to its right', () => {
  it('is italicized, and the extra underscore on the left does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now __free_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Italic([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 1 underscore to its left and 2 underscores to its right', () => {
  it('is italicized, and the extra underscore on the right does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now _free__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Italic([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 3 underscores to its left and 1 underscore to its right', () => {
  it('is italicized, and the extra 2 underscores on the left do not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now ___free_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Italic([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 3 underscores to its left and 2 underscores to its right', () => {
  it('is made bold, and the extra underscore on the left does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now ___free__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Bold([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 1 underscore to its left and 3 underscores to its right', () => {
  it('is italicized, and the 2 extra underscores on the right do not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now _free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Italic([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 2 underscore to its left and 3 underscores to its right', () => {
  it('is made bold, and the extra underscore on the right does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now __free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Bold([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})
