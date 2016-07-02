import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'


describe('Emphasis opened by an asterisk', () => {
  it('cannot be closed by an underscore', () => {
    expect(Up.toAst('Xamarin is now *free_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now *free_!'),
      ]))
  })
})


describe('Text surrounded on each side by an asterisk and an underscore', () => {
  it('is doubly emphasized, not stressed', () => {
    expect(Up.toAst('Koopas! _*Mario is on his way!*_ Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode('Mario is on his way!'),
          ]),
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })
})
