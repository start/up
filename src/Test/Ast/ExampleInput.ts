import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ExampleInputNode } from '../../SyntaxNodes/ExampleInputNode'


describe('Text surrounded by curly brackets', () => {
  it('is put into an input instruciton node', () => {
    expect(Up.toAst('Press {esc} to quit.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Press '),
        new ExampleInputNode('esc'),
        new PlainTextNode(' to quit.'),
      ]))
  })
})


describe('Example input', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toAst("Select the {Start Game(s)} menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Select the '),
        new ExampleInputNode('Start Games(s)'),
        new PlainTextNode(' menu item.')
      ]))
  })

  it('has any outer whitespace trimmed away', () => {
    expect(Up.toAst("Select the {  \t Start Game(s) \t  } menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Select the '),
        new ExampleInputNode('Start Games(s)'),
        new PlainTextNode(' menu item.')
      ]))
  })

  context('can contain escaped closing curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toAst("Press {\\}} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('}'),
          new PlainTextNode(' to view paths.')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toAst("Press { \\} } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('}'),
          new PlainTextNode(' to view paths.')
        ]))
    })
  })

  context('can contain unescaped opening curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toAst("Press {{} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('}'),
          new PlainTextNode(' to view paths')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toAst("Press { { } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('}'),
          new PlainTextNode(' to view paths')
        ]))
    })
  })

  it('can be directly followed by another input instruction', () => {
    expect(Up.toAst("Press {ctrl}{q} to quit.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new ExampleInputNode('Start Games(s)'),
        new PlainTextNode('!')
      ]))
  })
})
