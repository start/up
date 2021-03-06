import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Text surrounded by 2 asterisks to its left and 1 asterisk to its right', () => {
  it('is emphasized, and the extra asterisk on the left does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now **free*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Emphasis([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 1 asterisk to its left and 2 asterisks to its right', () => {
  it('is emphasized, and the extra asterisk on the right does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now *free**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Emphasis([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 3 asterisks to its left and 1 asterisk to its right', () => {
  it('is emphasized, and the extra 2 asterisks on the left do not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now ***free*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Emphasis([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 3 asterisks to its left and 2 asterisks to its right', () => {
  it('is stressed, and the extra asterisk on the left does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now ***free**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Stress([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 1 asterisk to its left and 3 asterisks to its right', () => {
  it('is emphasized, and the 2 extra asterisks on the right do not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now *free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Emphasis([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text surrounded by 2 asterisk to its left and 3 asterisks to its right', () => {
  it('is stressed, and the extra asterisk on the right does not appear in the final document as plain text', () => {
    expect(Up.parse('Xamarin is now **free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Stress([
          new Up.Text('free')
        ]),
        new Up.Text('!')
      ]))
  })
})
