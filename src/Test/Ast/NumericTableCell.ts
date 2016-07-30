import { expect } from 'chai'
import Up from '../../index'
import { TableNode } from '../../SyntaxNodes/TableNode'


function expectFirstTableCellToBeNumeric(textProducingTable: string): void {
  const documentNode = Up.toAst(textProducingTable)
  const table = documentNode.children[0] as TableNode

  expect(table.rows[0].cells[0].isNumeric()).to.be.true
}


context('A tale row cell is numeric if its text content (ignoring footnotes) contains digits and no spaces. This includes when the cell contains', () => {
  specify('an integer', () => {
    const text = `
Table:

Release Date

1995`

    expectFirstTableCellToBeNumeric(text)
  })
})