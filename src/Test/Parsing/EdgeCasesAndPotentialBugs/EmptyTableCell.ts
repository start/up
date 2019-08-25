import { expect } from 'chai'
import * as Up from '../../../Main'


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
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')])
            ])
          ])
      ]))
  })
})
