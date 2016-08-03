import { expect } from 'chai'
import Up from '../../index'
import { TableNode } from '../../SyntaxNodes/TableNode'


// Both tables and charts are represented by instances of the `TableNode` class. Likewise, both
// table row cells and chart row cells are represented by instances of `TableNode.Row.Cell`.
//
// To test whether a row cell is numeric, we call its `isNumeric` method, which evaluates the
// cell's contents and returns the result.
//
// Because testing table row cells and testing chart row cells both involve calling the same
// method on instances of the same class, and considering we verify elsewhere that both tables
// and charts produce proper syntax trees, we only need to test one of the two.
//
// For simplicity, we test tables.  

function expectTableCellToBeNumeric(rawCellValue: string): void {
  expectTableCell({
    withRawValue: rawCellValue,
    toBeNumeric: true
  })
}

function expectTableCellNotToBeNumeric(rawCellValue: string): void {
  expectTableCell({
    withRawValue: rawCellValue,
    toBeNumeric: false
  })
}

function expectTableCell(args: { withRawValue: string, toBeNumeric: boolean }): void {
  const { withRawValue, toBeNumeric } = args

  expect(isCellNumeric(withRawValue)).to.be.eql(toBeNumeric)
}

function isCellNumeric(rawCellValue: string): boolean {
  const markup = `
Table
Dummy Header Cell
${rawCellValue};`

  const table =
    Up.toAst(markup).children[0] as TableNode

  return table.rows[0].cells[0].isNumeric()
}


context('A table (or chart) row cell is numeric if its text content (ignoring footnotes) contains digits, no letters, no underscores, and no spaces.', () => {
  context('This includes', () => {
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

    specify('a NSFW convention whose content is numeric', () => {
      expectTableCellToBeNumeric('[NSFW: 80085]')
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


  context('This excludes', () => {
    specify('a single word without digits', () => {
      expectTableCellNotToBeNumeric('StarCraft')
    })

    specify('a word conaining digits and regular word characters', () => {
      expectTableCellNotToBeNumeric('3D')
    })

    specify('3 periods forming an ellipsis', () => {
      expectTableCellNotToBeNumeric('...')
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

    specify('a footnote on its own, even with numeric content', () => {
      expectTableCellNotToBeNumeric('[^ 2017]')
    })

    specify('multiple footnotes on their own, even if all have numeric content', () => {
      expectTableCellNotToBeNumeric('[^ 2017][^ 2018]')
    })

    specify('pure whitespace', () => {
      expectTableCellNotToBeNumeric(' \t \t')
    })

    specify('an empty string', () => {
      expectTableCellNotToBeNumeric('')
    })
  })
})
