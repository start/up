import { expect } from 'chai'
import Up from '../../index'
import { TableNode } from '../../SyntaxNodes/TableNode'


function expectTableCellToBeNumeric(rawCellValue: string): void {
  expectChartCellAndTableCell({
    withRawValue: rawCellValue,
    toBeNumeric: true
  })
}

function expectTableCellNotToBeNumeric(rawCellValue: string): void {
  expectChartCellAndTableCell({
    withRawValue: rawCellValue,
    toBeNumeric: false
  })
}

function expectChartCellAndTableCell(
  args: {
    withRawValue: string,
    toBeNumeric: boolean
  }
): void {
  const { withRawValue, toBeNumeric } = args

  specify('in a table row cell', () => {
    expect(isFirstRowCellNumeric('table', withRawValue)).to.be.eql(toBeNumeric)
  })

  specify('in a chart row cell', () => {
    expect(isFirstRowCellNumeric('chart', withRawValue)).to.be.eql(toBeNumeric)
  })
}

function isFirstRowCellNumeric(term: 'chart' | 'table', rawCellValue: string): boolean {
  const text = `
${term}
Header Cell
${term === 'chart' ? 'Row Header Cell;' : ''} ${rawCellValue};`

  const documentNode = Up.toAst(text)
  const table = documentNode.children[0] as TableNode

  return table.rows[0].cells[0].isNumeric()
}


context('A table (or chart) row cell is numeric if its text content (ignoring footnotes) contains digits, no letters, no underscores, and no spaces.', () => {
  context('This includes', () => {
    context('an integer', () => {
      expectTableCellToBeNumeric('1995')
    })

    context('an emphasized and stressed integer', () => {
      expectTableCellToBeNumeric('***1995***')
    })

    context('a decimal', () => {
      expectTableCellToBeNumeric('.5')
    })

    context('an emphasized and stressed integer', () => {
      expectTableCellToBeNumeric('***.5***')
    })

    context('an emphasized and stressed integer surrounded by whitespace', () => {
      expectTableCellToBeNumeric('  \t \t \t ***.5***  \t \t \t ')
    })

    context('a percentage', () => {
      expectTableCellToBeNumeric('55%')
    })

    context('an emphasized and stressed percentage', () => {
      expectTableCellToBeNumeric('***55%***')
    })

    context('an emphasized and stressed negative percentage', () => {
      expectTableCellToBeNumeric('***-55%***')
    })

    context('a percentage with the percent sign emphasized and stressed', () => {
      expectTableCellToBeNumeric('99***%***')
    })

    context('a time of day without the time period part', () => {
      expectTableCellToBeNumeric('15:40')
    })

    context('an emphasized and stressed time of day', () => {
      expectTableCellToBeNumeric('***15:40***')
    })

    context('a price', () => {
      expectTableCellToBeNumeric('$13.01')
    })

    context('an emphasized and stressed price', () => {
      expectTableCellToBeNumeric('***$13.01***')
    })

    context('a price whose dollar sign is emphasized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    context('a parenthesized price', () => {
      expectTableCellToBeNumeric('($13.01)')
    })

    context('a big number with commas grouping digits', () => {
      expectTableCellToBeNumeric('***$2,000,000***')
    })

    context('a price whose dollar sign is emphasized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    context('inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('`10.0`')
    })

    context('emphasized and stressed inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('***`10.0`***')
    })

    context('a link to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[$15.40] (example.com/price)')
    })

    context('a NSFW convention whose content is numeric', () => {
      expectTableCellToBeNumeric('[NSFW: 80085]')
    })

    context('a linkified spoiler to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[SPOILER: 44.7] (example.com/defense)')
    })

    context('an integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('2018 [^ It had been delayed since 2016]')
    })

    context('an emphasized and stressed integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('****2018**** [^ It had been delayed since 2016]')
    })
  })


  context('This excludes', () => {
    context('a single word without digits', () => {
      expectTableCellNotToBeNumeric('StarCraft')
    })

    context('a word conaining digits and regular word characters', () => {
      expectTableCellNotToBeNumeric('3D')
    })

    context('3 periods forming an ellipsis', () => {
      expectTableCellNotToBeNumeric('...')
    })

    context('a list of numbers separated by whitespace', () => {
      expectTableCellNotToBeNumeric('1 2 3')
    })

    context('a face with zeros for eyes and an underscore for its mouth', () => {
      expectTableCellNotToBeNumeric('0_0')
    })

    context('inline code containing a non-numeric word', () => {
      expectTableCellNotToBeNumeric('`<div>`')
    })

    context('a link to a numeric URL whose content is a non-numeric word', () => {
      expectTableCellNotToBeNumeric('[John] (tel:5555555555)')
    })

    context('a linkified spoiler to a numeric URL whose content is a non-numeric word', () => {
      expectTableCellNotToBeNumeric('[SPOILER: John] (tel:5555555555)')
    })

    context('an image, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[image: 9000] (64.233.160.0/123)')
    })

    context('an audio convention, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[audio: 9000] (64.233.160.0/123)')
    })

    context('a video, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[video: 9000] (64.233.160.0/123)')
    })

    context('a footnote on its own, even with numeric content', () => {
      expectTableCellNotToBeNumeric('[^ 2017]')
    })

    context('multiple footnotes on their own, even if all have numeric content', () => {
      expectTableCellNotToBeNumeric('[^ 2017][^ 2018]')
    })

    context('whitespace', () => {
      expectTableCellNotToBeNumeric(' \t \t')
    })

    context('an empty string', () => {
      expectTableCellNotToBeNumeric('')
    })
  })
})
