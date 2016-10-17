import { expect } from 'chai'
import * as Up from '../../../../Up'


context('Just like in a normal table, cells in a table with a header column can span multiple columns. The syntax is the same, and any cell can span multiple columns:', () => {
  specify('Header cells', () => {
    const markup = `
Table:

                     Director;;;

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Director')], 3)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Takashi Tokita')]),
              new Up.Table.Row.Cell([new Up.Text('Yoshinori Kitase')]),
              new Up.Table.Row.Cell([new Up.Text('Akihiko Matsui')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')]))
          ])
      ]))
  })

  specify('Row cells', () => {
    const markup = `
Table:

                    Developer;            Publisher;        Marketer;       Release Date

Chrono Trigger;     Square;;;                                               March 11, 1995
Terranigma;         Quintet;              Nintendo;         Quintet;        October 20, 1995
Command & Conquer;  Westwood Studios;;;                                     August 31, 1995
Starcraft;          Blizzard;;;                                             March 31, 1998`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')]),
            new Up.Table.Header.Cell([new Up.Text('Marketer')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Square')], 3),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Terranigma')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')], 3),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Command & Conquer')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Blizzard')], 3),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
            ], new Up.Table.Header.Cell([new Up.Text('Starcraft')]))
          ])
      ]))
  })

  specify('Header column cells', () => {
    const markup = `
Table: Summary of last work week

              Most Common Word;         Magical Happenings

Monday;;                                Pikachu evolved
Tuesday;;                               Break room destroyed by Psionic Storm
Wednesday;;                             Break room repaired by CSV
Thursday;     Really;                   Todd finished his work
Friday;;                                Printer had ink`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Most Common Word')]),
            new Up.Table.Header.Cell([new Up.Text('Magical Happenings')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Pikachu evolved')])
            ], new Up.Table.Header.Cell([new Up.Text('Monday')], 2)),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Break room destroyed by Psionic Storm')])
            ], new Up.Table.Header.Cell([new Up.Text('Tuesday')], 2)),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Break room repaired by CSV')])
            ], new Up.Table.Header.Cell([new Up.Text('Wednesday')], 2)),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Really')]),
              new Up.Table.Row.Cell([new Up.Text('Todd finished his work')])
            ], new Up.Table.Header.Cell([new Up.Text('Thursday')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Printer had ink')])
            ], new Up.Table.Header.Cell([new Up.Text('Friday')], 2))
          ],
          new Up.Table.Caption([
            new Up.Text('Summary of last work week')
          ]))
      ]))
  })
})
