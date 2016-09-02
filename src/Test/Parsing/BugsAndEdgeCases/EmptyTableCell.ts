import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Table } from '../../../SyntaxNodes/Table'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('A table header consisting only of a semicolon', () => {
  it('consists of a single empty cell', () => {
    const markup = `
Table:

;

Chrono Trigger
Starcraft`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
              new Table.Header.Cell([])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
            ])
          ])
      ]))
  })
})


describe('A table row consisting only of a semicolon', () => {
  it('consists of a single empty cell', () => {
    const markup = `
Table:

Game

Chrono Trigger
;
Starcraft`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
            ]),
            new Table.Row([
              new Table.Row.Cell([])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
            ])
          ])
      ]))
  })
})
