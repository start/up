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


context('A tale row cell is numeric if its text content (ignoring footnotes) contains digits, no word characters, and no spaces.', () => {
  context('This includes when the cell contains', () => {
    specify('an integer', () => {
      expectTableCellToBeNumeric('1995')
    })

    specify('an italicized and stressed integer', () => {
      expectTableCellToBeNumeric('***1995***')
    })

    specify('a decimal', () => {
      expectTableCellToBeNumeric('.5')
    })

    specify('an italicized and stressed integer', () => {
      expectTableCellToBeNumeric('***.5***')
    })

    specify('an italicized and stressed integer surrounded by whitespace', () => {
      expectTableCellToBeNumeric('  \t \t \t ***.5***  \t \t \t ')
    })

    specify('a percentage', () => {
      expectTableCellToBeNumeric('55%')
    })

    specify('an italicized and stressed percentage', () => {
      expectTableCellToBeNumeric('***55%***')
    })

    specify('a percentage with the percent sign italicized and stressed', () => {
      expectTableCellToBeNumeric('99***%***')
    })

    specify('a price', () => {
      expectTableCellToBeNumeric('$13.01')
    })

    specify('an italicized and stressed price', () => {
      expectTableCellToBeNumeric('***$13.01***')
    })

    specify('a price whose dollar sign is italicized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    specify('a parenthesized price', () => {
      expectTableCellToBeNumeric('($13.01)')
    })

    specify('a big number with commas grouping digits', () => {
      expectTableCellToBeNumeric('***$2,000,000***')
    })

    specify('a price whose dollar sign is italicized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    specify('inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('`10.0`')
    })

    specify('italicized and stressed inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('***`10.0`***')
    })

    specify('a link to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[$15.40] (https://example.com/price)')
    })

    specify('a linkified spoiler to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[SPOILER: 44.7] (https://example.com/defense)')
    })

    specify('an integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('2018 [^ It had been delayed since 2016]')
    })

    specify('an italicized and stressed integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('****2018**** [^ It had been delayed since 2016]')
    })
  })


  context('This excludes when the cell contains', () => {
    specify('a single without digits', () => {
      expectTableCellNotToBeNumeric('StarCraft')
    })

    specify('a word conaining digits and regular word characters', () => {
      expectTableCellNotToBeNumeric('3D')
    })

    specify('a list of numbers separated by whitespace', () => {
      expectTableCellNotToBeNumeric('1 2 3')
    })

    specify('inline code containing a non-numeric word', () => {
      expectTableCellNotToBeNumeric('`<div>`')
    })

    specify('a link to a numeric URL whose content is a non-numeric word', () => {
      expectTableCellNotToBeNumeric('[John] (tel:5555555555)')
    })

    specify('a linkified spoiler to a numeric URL whose content is a non-numeric word', () => {
      expectTableCellNotToBeNumeric('[SPOILER: John] (tel:5555555555)')
    })

    specify('whitespace', () => {
      expectTableCellNotToBeNumeric(' \t \t')
    })

    specify('nothing', () => {
      expectTableCellNotToBeNumeric('')
    })
  })
})
