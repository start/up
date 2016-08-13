import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ItalicNode } from '../../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../../SyntaxNodes/BoldNode'


describe('Text surrounded by 2 underscores to its left and 1 underscore to its right', () => {
  it('is italicized, and the extra underscore on the left does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now __free_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new ItalicNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 1 underscore to its left and 2 underscores to its right', () => {
  it('is italicized, and the extra underscore on the right does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now _free__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new ItalicNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 3 underscores to its left and 1 underscore to its right', () => {
  it('is italicized, and the extra 2 underscores on the left do not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now ___free_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new ItalicNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 3 underscores to its left and 2 underscores to its right', () => {
  it('is made bold, and the extra underscore on the left does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now ___free__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new BoldNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 1 underscore to its left and 3 underscores to its right', () => {
  it('is italicized, and the 2 extra underscores on the right do not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now _free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new ItalicNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 2 underscore to its left and 3 underscores to its right', () => {
  it('is made bold, and the extra underscore on the right does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now __free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new BoldNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})
