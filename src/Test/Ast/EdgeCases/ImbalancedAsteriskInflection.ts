import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'


describe('Text surrounded by 2 asterisks to its left and 1 asterisk to its right', () => {
  it('is emphasized, and the extra asterisk on the left does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now **free*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new EmphasisNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 1 asterisk to its left and 2 asterisks to its right', () => {
  it('is emphasized, and the extra asterisk on the right does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now *free**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new EmphasisNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 3 asterisks to its left and 1 asterisk to its right', () => {
  it('is emphasized, and the extra 2 asterisks on the left do not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now ***free*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new EmphasisNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 3 asterisks to its left and 2 asterisks to its right', () => {
  it('is stressed, and the extra asterisk on the left does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now ***free**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new StressNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 1 asterisk to its left and 3 asterisks to its right', () => {
  it('is emphasized, and the 2 extra asterisks on the right do not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now *free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new EmphasisNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by 2 asterisk to its left and 3 asterisks to its right', () => {
  it('is stressed, and the extra asterisk on the right does not appear in the final document as plain text', () => {
    expect(Up.toAst('Xamarin is now **free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new StressNode([
          new PlainTextNode('free'),
        ]),
        new PlainTextNode('!')
      ]))
  })
})
