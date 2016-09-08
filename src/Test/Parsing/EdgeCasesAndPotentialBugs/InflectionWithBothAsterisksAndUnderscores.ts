import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Stress } from '../../../SyntaxNodes/Stress'
import { Italic } from '../../../SyntaxNodes/Italic'
import { Bold } from '../../../SyntaxNodes/Bold'


describe('Emphasis', () => {
  it('cannot be closed by an underscore', () => {
    expect(Up.parse('Xamarin is now *free_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is now *free_!'),
      ]))
  })
})


describe('Italics', () => {
  it('cannot be closed by an asterisk', () => {
    expect(Up.parse('Xamarin is now _free*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is now _free*!'),
      ]))
  })
})


describe('Text surrounded by an underscore and an asterisk on each side', () => {
  it('is italicized and emphasized', () => {
    expect(Up.parse('Koopas! _*Mario is on his way!*_ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Koopas! '),
        new Italic([
          new Emphasis([
            new PlainText('Mario is on his way!'),
          ]),
        ]),
        new PlainText(' Grab your shells!')
      ]))
  })
})


describe('Text surrounded by double asterisk and double underscores on each side', () => {
  it('is stressed and bold', () => {
    expect(Up.parse('Koopas! **__Mario is on his way!__** Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Koopas! '),
        new Stress([
          new Bold([
            new PlainText('Mario is on his way!'),
          ]),
        ]),
        new PlainText(' Grab your shells!')
      ]))
  })
})
