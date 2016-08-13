import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { ItalicNode } from '../../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../../SyntaxNodes/BoldNode'


describe('Emphasis', () => {
  it('cannot be closed by an underscore', () => {
    expect(Up.toAst('Xamarin is now *free_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now *free_!'),
      ]))
  })
})


describe('Italics', () => {
  it('cannot be closed by an asterisk', () => {
    expect(Up.toAst('Xamarin is now _free*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now _free*!'),
      ]))
  })
})


describe('Text surrounded by an underscore and an asterisk on each side', () => {
  it('is italicized and emphasized', () => {
    expect(Up.toAst('Koopas! _*Mario is on his way!*_ Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new ItalicNode([
          new EmphasisNode([
            new PlainTextNode('Mario is on his way!'),
          ]),
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })
})


describe('Text surrounded by double asterisk and double underscores on each side', () => {
  it('is stressed and bold', () => {
    expect(Up.toAst('Koopas! **__Mario is on his way!__** Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new BoldNode([
          new StressNode([
            new PlainTextNode('Mario is on his way!'),
          ]),
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })
})