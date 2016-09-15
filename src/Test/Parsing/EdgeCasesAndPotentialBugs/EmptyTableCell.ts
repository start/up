import { expect } from 'chai'
import * as Up from '../../../index'


describe('A table header consisting only of a semicolon', () => {
  it('consists of a single empty cell', () => {
    const markup = `
Table:

;

Chrono Trigger
Starcraft`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
              new Up.Table.Header.Cell([])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
            ])
          ])
      ]))
  })
})
