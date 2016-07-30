import { expect } from 'chai'
import Up from '../../index'
import { TableNode } from '../../SyntaxNodes/TableNode'


function expectTableCellToBeNumeric(rawCellValue: string): void {
  expect(isTableCellNumeric(rawCellValue)).to.be.true
}

function expectTableCellNotToBeNumeric(rawCellValue: string): void {
  expect(isTableCellNumeric(rawCellValue)).to.be.false
}

function isTableCellNumeric(rawCellValue: string): boolean {
  const tableText = `
Table:
Header Cell 1; Header Cell 2
${rawCellValue};`

  const documentNode = Up.toAst(tableText)
  const table = documentNode.children[0] as TableNode

  return table.rows[0].cells[0].isNumeric()
}


context('A tale row cell is numeric if its text content (ignoring footnotes) contains digits and no spaces.', () => {
  context('This includes when the cell contains', () => {
    specify('an integer', () => {
      expectTableCellToBeNumeric('1995')
    })

    specify('an italicized and stressed integer', () => {
      expectTableCellToBeNumeric('***1995***')
    })

    specify('a time of day', () => {
      expectTableCellToBeNumeric('10:10am')
    })

    specify('an italicized and stressed time of day', () => {
      expectTableCellToBeNumeric('***10:10am***')
    })

    specify('a time of day with the time period italicized and stressed', () => {
      expectTableCellToBeNumeric('10:10***am***')
    })

    specify('a price', () => {
      expectTableCellToBeNumeric('$13.01')
    })

    specify('an italicized and stressed price', () => {
      expectTableCellToBeNumeric('***$13.01***')
    })

    specify('inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('`10.0f`')
    })

    specify('italicized and stressed inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('***`10.0f`***')
    })

    specify('a link to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[$15.40] (https://example.com/price)')
    })

    specify('a linkified spoiler to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[SPOILER: 44.7] (https://example.com/defense)')
    })

    specify('an integer followed by a non-numeric footnote separated from the integer by whitespace', () => {
      expectTableCellToBeNumeric('2018 [^ It had been delayed since 2016]')
    })

    specify('an italicized and stressed integer followed by a non-numeric footnote separated from the integer by whitespace', () => {
      expectTableCellToBeNumeric('****2018**** [^ It had been delayed since 2016]')
    })
  })


  context('This excludes when the cell contains', () => {
    specify('a single non-integer word', () => {
      expectTableCellNotToBeNumeric('StarCraft')
    })

    specify('a movie sequel', () => {
      expectTableCellNotToBeNumeric('Lion King 2')
    })

    specify('inline code with a non-numeric value', () => {
      expectTableCellNotToBeNumeric('`<div>`')
    })

    specify('a link to a numeric URL whose content is a non-numeric word', () => {
      expectTableCellNotToBeNumeric('[John] (tel:5555555555)')
    })

    specify('a linkified spoiler to a numeric URL whose content is a non-numeric word', () => {
      expectTableCellNotToBeNumeric('[SPOILER: John] (tel:5555555555)')
    })

    specify('nothing', () => {
      expectTableCellNotToBeNumeric('')
    })
  })
})
