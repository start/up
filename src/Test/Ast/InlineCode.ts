import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'


describe('Text surrounded by backticks', () => {
  it('is put into an inline code node', () => {
    expect(Up.toAst('`gabe.attack(james)`')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineCodeNode('gabe.attack(james)'),
      ]))
  })
})


describe('Inline code', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toAst('Hello, `*Bruno*`!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode('*Bruno*'),
        new PlainTextNode('!')
      ]))
  })
})


describe('Backslashes inside inline code', () => {
  it('are preserved', () => {
    expect(Up.toAst('Whiteboard `\\"prop\\"`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Whiteboard '),
        new InlineCodeNode('\\"prop\\"')
      ]))
  })
  
  it('do not escape the enclosing backticks', () => {
    expect(Up.toAst('Funny lines: `/|\\`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Funny lines: '),
        new InlineCodeNode('/|\\')
      ]))
  })
})
