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


context('A tale row cell is numeric if its text content (ignoring footnotes) contains digits, no letters, no underscores, and no spaces.', () => {
  context('This includes when the cell contains', () => {
    specify('an integer', () => {
      expectTableCellToBeNumeric('1995')
    })

    specify('an emphasized and stressed integer', () => {
      expectTableCellToBeNumeric('***1995***')
    })

    specify('a decimal', () => {
      expectTableCellToBeNumeric('.5')
    })

    specify('an emphasized and stressed integer', () => {
      expectTableCellToBeNumeric('***.5***')
    })

    specify('an emphasized and stressed integer surrounded by whitespace', () => {
      expectTableCellToBeNumeric('  \t \t \t ***.5***  \t \t \t ')
    })

    specify('a percentage', () => {
      expectTableCellToBeNumeric('55%')
    })

    specify('an emphasized and stressed percentage', () => {
      expectTableCellToBeNumeric('***55%***')
    })

    specify('an emphasized and stressed negative percentage', () => {
      expectTableCellToBeNumeric('***-55%***')
    })

    specify('a percentage with the percent sign emphasized and stressed', () => {
      expectTableCellToBeNumeric('99***%***')
    })

    specify('a time of day without the time period part', () => {
      expectTableCellToBeNumeric('15:40')
    })

    specify('an emphasized and stressed time of day', () => {
      expectTableCellToBeNumeric('***15:40***')
    })

    specify('a price', () => {
      expectTableCellToBeNumeric('$13.01')
    })

    specify('an emphasized and stressed price', () => {
      expectTableCellToBeNumeric('***$13.01***')
    })

    specify('a price whose dollar sign is emphasized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    specify('a parenthesized price', () => {
      expectTableCellToBeNumeric('($13.01)')
    })

    specify('a big number with commas grouping digits', () => {
      expectTableCellToBeNumeric('***$2,000,000***')
    })

    specify('a price whose dollar sign is emphasized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    specify('inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('`10.0`')
    })

    specify('emphasized and stressed inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('***`10.0`***')
    })

    specify('a link to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[$15.40] (example.com/price)')
    })

    specify('a linkified spoiler to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[SPOILER: 44.7] (example.com/defense)')
    })

    specify('an integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('2018 [^ It had been delayed since 2016]')
    })

    specify('an emphasized and stressed integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('****2018**** [^ It had been delayed since 2016]')
    })
  })


  context('This excludes when the cell contains', () => {
    specify('a single word without digits', () => {
      expectTableCellNotToBeNumeric('StarCraft')
    })

    specify('a word conaining digits and regular word characters', () => {
      expectTableCellNotToBeNumeric('3D')
    })

    specify('a list of numbers separated by whitespace', () => {
      expectTableCellNotToBeNumeric('1 2 3')
    })

    specify('a face with zeros for eyes and an underscore for its mouth', () => {
      expectTableCellNotToBeNumeric('0_0')
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

    specify('an image, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[image: 9000] (64.233.160.0/123)')
    })

    specify('an audio convention, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[audio: 9000] (64.233.160.0/123)')
    })

    specify('a video, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[video: 9000] (64.233.160.0/123)')
    })

    specify('whitespace', () => {
      expectTableCellNotToBeNumeric(' \t \t')
    })

    specify('nothing', () => {
      expectTableCellNotToBeNumeric('')
    })
  })
})
