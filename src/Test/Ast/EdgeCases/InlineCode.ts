import { expect } from 'chai'
import { Up } from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'


describe('Inline code', () => {
  it('can be the last convention in a paragraph', () => {
    expect(Up.toAst('Dropship `harass`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Dropship '),
        new InlineCodeNode('harass')
      ]))
  })
})


describe('An unmatched backtick', () => {
  it('does not produce any inline code', () => {
    expect(Up.toAst('I don`t ever do this')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I don`t ever do this')
      ]))
  })
})
