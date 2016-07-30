import { expect } from 'chai'
import Up from '../../index'
import { TableNode } from '../../SyntaxNodes/TableNode'


function expectFirstTableCellToBeNumeric(textProducingTable: string): void {
  expect(isFirstTableCellNumeric(textProducingTable)).to.be.true
}

function expectFirstTableCellNotToBeNumeric(textProducingTable: string): void {
  expect(isFirstTableCellNumeric(textProducingTable)).to.be.false
}

function isFirstTableCellNumeric(textProducingTable: string): boolean {
  const documentNode = Up.toAst(textProducingTable)
  const table = documentNode.children[0] as TableNode

  return table.rows[0].cells[0].isNumeric()
}


context('A tale row cell is numeric if its text content (ignoring footnotes) contains digits and no spaces.', () => {
  context('This includes when the cell contains', () => {
    specify('an integer', () => {
      const text = `
Table:
Release Date
1995`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('an italicized and stressed integer', () => {
      const text = `
Table:
Release Date
***1995***`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('a time of day', () => {
      const text = `
Table:
Release Time
10:10am`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('an italicized and stressed time of day', () => {
      const text = `
Table:
Release Time
*10:10am*`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('a time of day with the time period italicized and stressed', () => {
      const text = `
Table:
Release Time
10:10***am***`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('a time of day', () => {
      const text = `
Table:
Release Time
10:10am`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('a price', () => {
      const text = `
Table:
Price
$13.01`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('an italicized and stressed price', () => {
      const text = `
Table:
Price
$13.01`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('inline code containing a numeric value', () => {
      const text = `
Table:
Notation
\`10.0f\``

      expectFirstTableCellToBeNumeric(text)
    })

    specify('italicized and stressed inline code containing a numeric value', () => {
      const text = `
Table:
Notation
***\`10.0f\`***`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('a link to a non-numeric URL whose content is numeric', () => {
      const text = `
Table:
Price
[$15.40] (https://example.com/price)`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('a linkified spoiler to a non-numeric URL whose content is numeric', () => {
      const text = `
Table:
Defense Value
[SPOILER: 44.7] (https://example.com/defense)`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('an integer followed by a non-numeric footnote separated from the integer by whitespace', () => {
      const text = `
Table:
Release Date
2018 [^ It had been delayed since 2016]`

      expectFirstTableCellToBeNumeric(text)
    })

    specify('an italicized and stressed integer followed by a non-numeric footnote separated from the integer by whitespace', () => {
      const text = `
Table:
Release Date
****2018**** [^ It had been delayed since 2016]`

      expectFirstTableCellToBeNumeric(text)
    })
  })


  context('This excludes when the cell contains', () => {
    specify('a single non-integer word', () => {
      const text = `
Table:
Game
StarCraft`

      expectFirstTableCellNotToBeNumeric(text)
    })

    specify('a movie sequel', () => {
      const text = `
Table:
Movie
Lion King 2`

      expectFirstTableCellNotToBeNumeric(text)
    })

    specify('inline code with a non-numeric value', () => {
      const text = `
Table:
Element
\`<div>\``

      expectFirstTableCellNotToBeNumeric(text)
    })

    specify('a link to a numeric URL whose content is not numeric', () => {
      const text = `
Table:
Contact
[John] (tel:5555555555)`

      expectFirstTableCellNotToBeNumeric(text)
    })

    specify('a linkified spoiler to a numeric URL whose content is not numeric', () => {
      const text = `
Table:
Secret Santa
[SPOILER: John] (tel:5555555555)`

      expectFirstTableCellNotToBeNumeric(text)
    })

    specify('nothing', () => {
      const text = `
Table:
Element
;`

      expectFirstTableCellNotToBeNumeric(text)
    })
  })
})
