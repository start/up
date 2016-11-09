import { expect } from 'chai'
import * as Up from '../../Main'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by curly brackets', () => {
  it('is put into an example input node', () => {
    expect(Up.parse('Press {esc} to quit.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Press '),
        new Up.ExampleUserInput('esc'),
        new Up.Text(' to quit.'),
      ]))
  })
})


describe('Example input', () => {
  it('is not evaluated for other (non-typographical) conventions', () => {
    expect(Up.parse("Select the {Start Game(s)} menu item.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Select the '),
        new Up.ExampleUserInput('Start Game(s)'),
        new Up.Text(' menu item.')
      ]))
  })

  it('has any outer whitespace trimmed away', () => {
    expect(Up.parse("Select the {  \t Start Game(s) \t  } menu item.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Select the '),
        new Up.ExampleUserInput('Start Game(s)'),
        new Up.Text(' menu item.')
      ]))
  })


  context('can contain escaped closing curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Press {\\}} to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Press '),
          new Up.ExampleUserInput('}'),
          new Up.Text(' to view paths.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Press { \\} } to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Press '),
          new Up.ExampleUserInput('}'),
          new Up.Text(' to view paths.')
        ]))
    })
  })


  context('can contain escaped opening curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Press {\\{} to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Press '),
          new Up.ExampleUserInput('{'),
          new Up.Text(' to view paths.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Press { \\{ } to view paths.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Press '),
          new Up.ExampleUserInput('{'),
          new Up.Text(' to view paths.')
        ]))
    })
  })


  context('can contain unescaped matching curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Select the {Start Game{s}} menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Select the '),
          new Up.ExampleUserInput('Start Game{s}'),
          new Up.Text(' menu item.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Select the { Start Game{s} } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Select the '),
          new Up.ExampleUserInput('Start Game{s}'),
          new Up.Text(' menu item.')
        ]))
    })
  })


  context('can contain unescaped nesting matching curly brackets', () => {
    specify('touching the delimiters', () => {
      expect(Up.parse("Select the {{Start Game{s}}} menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Select the '),
          new Up.ExampleUserInput('{Start Game{s}}'),
          new Up.Text(' menu item.')
        ]))
    })

    specify('not touching the delimiters', () => {
      expect(Up.parse("Select the { {Start Game{s}} } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Select the '),
          new Up.ExampleUserInput('{Start Game{s}}'),
          new Up.Text(' menu item.')
        ]))
    })
  })


  it('can be directly followed by another input instruction', () => {
    expect(Up.parse("Press {ctrl}{q} to quit.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Press '),
        new Up.ExampleUserInput('ctrl'),
        new Up.ExampleUserInput('q'),
        new Up.Text(' to quit.')
      ]))
  })


  context('is evaluated for typographical conventions:', () => {
    specify('En dashes', () => {
      expect(Up.parse("Select the { Start Game -- Single Player } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Select the '),
          new Up.ExampleUserInput('Start Game – Single Player'),
          new Up.Text(' menu item.')
        ]))
    })

    specify('Em dashes', () => {
      expect(Up.parse("Select the { Start Game --- Single Player } menu item.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Select the '),
          new Up.ExampleUserInput('Start Game — Single Player'),
          new Up.Text(' menu item.')
        ]))
    })

    specify('Plus-minus signs', () => {
      expect(Up.parse("Click the {+-5 minutes} button.")).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('Click the '),
          new Up.ExampleUserInput('±5 minutes'),
          new Up.Text(' button.')
        ]))
    })
  })
})


describe('An unmatched curly bracket', () => {
  it('is preserved as plain text', () => {
    expect(Up.parse('Yeah... :{ I hate pizza.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah… :{ I hate pizza.')
      ]))
  })

  it('does not interfere with subsequent inline conventions', () => {
    expect(Up.parse('Yeah... :{ I *hate* pizza.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Yeah… :{ I '),
        new Up.Emphasis([
          new Up.Text('hate'),
        ]),
        new Up.Text(' pizza.'),
      ]))
  })
})
