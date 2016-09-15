import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by curly brackets', () => {
  it('is put into an example input node', () => {
    expect(Up.parse('Press {esc} to quit.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Press '),
        new Up.ExampleInput('esc'),
        new Up.PlainText(' to quit.'),
      ]))
  })
})


describe('Example input', () => {
  it('is not evaluated for other (non-typographical) conventions', () => {
    expect(Up.parse("Select the {Start Game(s)} menu item.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Select the '),
        new Up.ExampleInput('Start Game(s)'),
        new Up.PlainText(' menu item.')
      ]))
  })

  it('has any outer whitespace trimmed away', () => {
    expect(Up.parse("Select the {  \t Start Game(s) \t  } menu item.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Select the '),
        new Up.ExampleInput('Start Game(s)'),
        new Up.PlainText(' menu item.')
      ]))
  })


  context('can contain escaped closing curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Press {\\}} to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Press '),
          new Up.ExampleInput('}'),
          new Up.PlainText(' to view paths.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Press { \\} } to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Press '),
          new Up.ExampleInput('}'),
          new Up.PlainText(' to view paths.')
        ]))
    })
  })


  context('can contain escaped opening curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Press {\\{} to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Press '),
          new Up.ExampleInput('{'),
          new Up.PlainText(' to view paths.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Press { \\{ } to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Press '),
          new Up.ExampleInput('{'),
          new Up.PlainText(' to view paths.')
        ]))
    })
  })


  context('can contain unescaped matching curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Select the {Start Game{s}} menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Select the '),
          new Up.ExampleInput('Start Game{s}'),
          new Up.PlainText(' menu item.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Select the { Start Game{s} } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Select the '),
          new Up.ExampleInput('Start Game{s}'),
          new Up.PlainText(' menu item.')
        ]))
    })
  })


  context('can contain unescaped nesting matching curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Select the {{Start Game{s}}} menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Select the '),
          new Up.ExampleInput('{Start Game{s}}'),
          new Up.PlainText(' menu item.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Select the { {Start Game{s}} } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Select the '),
          new Up.ExampleInput('{Start Game{s}}'),
          new Up.PlainText(' menu item.')
        ]))
    })
  })


  it('can be directly followed by another input instruction', () => {
    expect(Up.parse("Press {ctrl}{q} to quit.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Press '),
        new Up.ExampleInput('ctrl'),
        new Up.ExampleInput('q'),
        new Up.PlainText(' to quit.')
      ]))
  })


  context('is evaluated for typographical conventions:', () => {
    specify('En dashes', () => {
      expect(Up.parse("Select the { Start Game -- Single Player } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Select the '),
          new Up.ExampleInput('Start Game – Single Player'),
          new Up.PlainText(' menu item.')
        ]))
    })

    specify('Em dashes', () => {
      expect(Up.parse("Select the { Start Game --- Single Player } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Select the '),
          new Up.ExampleInput('Start Game — Single Player'),
          new Up.PlainText(' menu item.')
        ]))
    })

    specify('Plus-minus signs', () => {
      expect(Up.parse("Click the {+-5 minutes} button.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('Click the '),
          new Up.ExampleInput('±5 minutes'),
          new Up.PlainText(' button.')
        ]))
    })
  })
})


describe('An unmatched curly bracket', () => {
  it('is preserved as plain text', () => {
    expect(Up.parse('Yeah... :{ I hate pizza.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Yeah… :{ I hate pizza.')
      ]))
  })

  it('does not interfere with subsequent inline conventions', () => {
    expect(Up.parse('Yeah... :{ I *hate* pizza.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Yeah… :{ I '),
        new Up.Emphasis([
          new Up.PlainText('hate'),
        ]),
        new Up.PlainText(' pizza.'),
      ]))
  })
})
