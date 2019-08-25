import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Emphasis', () => {
  it('cannot be closed by an underscore', () => {
    expect(Up.parse('Xamarin is now *free_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now *free_!')
      ]))
  })
})


describe('Italics', () => {
  it('cannot be closed by an asterisk', () => {
    expect(Up.parse('Xamarin is now _free*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now _free*!')
      ]))
  })
})


describe('Text surrounded by an underscore and an asterisk on each side', () => {
  it('is italicized and emphasized', () => {
    expect(Up.parse('Koopas! _*Mario is on his way!*_ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Koopas! '),
        new Up.Italic([
          new Up.Emphasis([
            new Up.Text('Mario is on his way!')
          ])
        ]),
        new Up.Text(' Grab your shells!')
      ]))
  })
})


describe('Text surrounded by double asterisk and double underscores on each side', () => {
  it('is stressed and bold', () => {
    expect(Up.parse('Koopas! **__Mario is on his way!__** Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Koopas! '),
        new Up.Stress([
          new Up.Bold([
            new Up.Text('Mario is on his way!')
          ])
        ]),
        new Up.Text(' Grab your shells!')
      ]))
  })
})
