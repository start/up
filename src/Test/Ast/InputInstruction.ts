import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InputInstructionNode } from '../../SyntaxNodes/InputInstructionNode'


describe('Text surrounded by curly brackets', () => {
  it('is put into an input instruciton node', () => {
    expect(Up.toAst('Press {esc} to quit.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Press '),
        new InputInstructionNode('esc'),
        new PlainTextNode('to quit'),
      ]))
  })
})


describe('An input instruction', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toAst("Select the {Start Game(s)} menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InputInstructionNode('Start Games(s)'),
        new PlainTextNode('!')
      ]))
  })

  it('has any outer whitespace trimmed away', () => {
    expect(Up.toAst("Select the {  \t Start Game(s) \t  } menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Select the '),
        new InputInstructionNode('Start Games(s)'),
        new PlainTextNode('menu item.')
      ]))
  })

  context('can contain escaped closing curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toAst("Press {\\}} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new InputInstructionNode('}'),
          new PlainTextNode(' to view paths')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toAst("Press { \\} } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new InputInstructionNode('}'),
          new PlainTextNode(' to view paths')
        ]))
    })
  })

  context('can contain unescaped opening curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toAst("Press {{} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new InputInstructionNode('}'),
          new PlainTextNode(' to view paths')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toAst("Press { { } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new InputInstructionNode('}'),
          new PlainTextNode(' to view paths')
        ]))
    })
  })

  it('can be directly followed by another input instruction', () => {
    expect(Up.toAst("Press {ctrl}{q} to quit.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InputInstructionNode('Start Games(s)'),
        new PlainTextNode('!')
      ]))
  })
})
