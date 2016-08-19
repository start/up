import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ExampleInputNode } from '../../SyntaxNodes/ExampleInputNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'


describe('Text surrounded by curly brackets', () => {
  it('is put into an input instruciton node', () => {
    expect(Up.toDocument('Press {esc} to quit.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Press '),
        new ExampleInputNode('esc'),
        new PlainTextNode(' to quit.'),
      ]))
  })
})


describe('Example input', () => {
  it('is not evaluated for other (non-typographical) conventions', () => {
    expect(Up.toDocument("Select the {Start Game(s)} menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Select the '),
        new ExampleInputNode('Start Game(s)'),
        new PlainTextNode(' menu item.')
      ]))
  })

  it('has any outer whitespace trimmed away', () => {
    expect(Up.toDocument("Select the {  \t Start Game(s) \t  } menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Select the '),
        new ExampleInputNode('Start Game(s)'),
        new PlainTextNode(' menu item.')
      ]))
  })

  context('can contain escaped closing curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toDocument("Press {\\}} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('}'),
          new PlainTextNode(' to view paths.')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toDocument("Press { \\} } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('}'),
          new PlainTextNode(' to view paths.')
        ]))
    })
  })

  context('can contain unescaped opening curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toDocument("Press {{} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('{'),
          new PlainTextNode(' to view paths.')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toDocument("Press { { } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Press '),
          new ExampleInputNode('{'),
          new PlainTextNode(' to view paths.')
        ]))
    })
  })

  it('can be directly followed by another input instruction', () => {
    expect(Up.toDocument("Press {ctrl}{q} to quit.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Press '),
        new ExampleInputNode('ctrl'),
        new ExampleInputNode('q'),
        new PlainTextNode(' to quit.')
      ]))
  })


  context('is evaluated for typographical conventions, including', () => {
    specify('en dashes', () => {
      expect(Up.toDocument("Select the { Start Game -- Single Player } menu item.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Select the '),
          new ExampleInputNode('Start Game – Single Player'),
          new PlainTextNode(' menu item.')
        ]))
    })

    specify('em dashes', () => {
      expect(Up.toDocument("Select the { Start Game --- Single Player } menu item.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Select the '),
          new ExampleInputNode('Start Game — Single Player'),
          new PlainTextNode(' menu item.')
        ]))
    })

    specify('plus-minus signs', () => {
      expect(Up.toDocument("Click the {+-5 minutes} button.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('Click the '),
          new ExampleInputNode('±5 minutes'),
          new PlainTextNode(' button.')
        ]))
    })
  })
})


describe('An unmatched curly bracket', () => {
  it('is preserved as plain text', () => {
    expect(Up.toDocument('Yeah... :{ I hate pizza.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Yeah... :{ I hate pizza.')
      ]))
  })

  it('does not interfere with subsequent inline conventions', () => {
    expect(Up.toDocument('Yeah... :{ I *hate* pizza.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Yeah... :{ I '),
        new Emphasis([
          new PlainTextNode('hate'),
        ]),
        new PlainTextNode(' pizza.'),
      ]))
  })
})
