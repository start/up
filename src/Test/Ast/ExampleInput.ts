import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { ExampleInput } from '../../SyntaxNodes/ExampleInput'
import { Emphasis } from '../../SyntaxNodes/Emphasis'


describe('Text surrounded by curly brackets', () => {
  it('is put into an input instruciton node', () => {
    expect(Up.toDocument('Press {esc} to quit.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Press '),
        new ExampleInput('esc'),
        new PlainText(' to quit.'),
      ]))
  })
})


describe('Example input', () => {
  it('is not evaluated for other (non-typographical) conventions', () => {
    expect(Up.toDocument("Select the {Start Game(s)} menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Select the '),
        new ExampleInput('Start Game(s)'),
        new PlainText(' menu item.')
      ]))
  })

  it('has any outer whitespace trimmed away', () => {
    expect(Up.toDocument("Select the {  \t Start Game(s) \t  } menu item.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Select the '),
        new ExampleInput('Start Game(s)'),
        new PlainText(' menu item.')
      ]))
  })

  context('can contain escaped closing curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toDocument("Press {\\}} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('Press '),
          new ExampleInput('}'),
          new PlainText(' to view paths.')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toDocument("Press { \\} } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('Press '),
          new ExampleInput('}'),
          new PlainText(' to view paths.')
        ]))
    })
  })

  context('can contain unescaped opening curly brackets', () => {
    it('touching the delimiters', () => {
      expect(Up.toDocument("Press {{} to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('Press '),
          new ExampleInput('{'),
          new PlainText(' to view paths.')
        ]))
    })

    it('not touching the delimiters', () => {
      expect(Up.toDocument("Press { { } to view paths.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('Press '),
          new ExampleInput('{'),
          new PlainText(' to view paths.')
        ]))
    })
  })

  it('can be directly followed by another input instruction', () => {
    expect(Up.toDocument("Press {ctrl}{q} to quit.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Press '),
        new ExampleInput('ctrl'),
        new ExampleInput('q'),
        new PlainText(' to quit.')
      ]))
  })


  context('is evaluated for typographical conventions, including', () => {
    specify('en dashes', () => {
      expect(Up.toDocument("Select the { Start Game -- Single Player } menu item.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('Select the '),
          new ExampleInput('Start Game – Single Player'),
          new PlainText(' menu item.')
        ]))
    })

    specify('em dashes', () => {
      expect(Up.toDocument("Select the { Start Game --- Single Player } menu item.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('Select the '),
          new ExampleInput('Start Game — Single Player'),
          new PlainText(' menu item.')
        ]))
    })

    specify('plus-minus signs', () => {
      expect(Up.toDocument("Click the {+-5 minutes} button.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('Click the '),
          new ExampleInput('±5 minutes'),
          new PlainText(' button.')
        ]))
    })
  })
})


describe('An unmatched curly bracket', () => {
  it('is preserved as plain text', () => {
    expect(Up.toDocument('Yeah... :{ I hate pizza.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Yeah... :{ I hate pizza.')
      ]))
  })

  it('does not interfere with subsequent inline conventions', () => {
    expect(Up.toDocument('Yeah... :{ I *hate* pizza.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Yeah... :{ I '),
        new Emphasis([
          new PlainText('hate'),
        ]),
        new PlainText(' pizza.'),
      ]))
  })
})
