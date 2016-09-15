import { expect } from 'chai'
import Up = require('../../index')
import { Document } from '../../SyntaxNodes/Document'
import { Table } from '../../SyntaxNodes/Table'
import { PlainText } from '../../SyntaxNodes/PlainText'


context('Just like in a table, cells in a chart can span multiple columns. The syntax is the same. Any chart cell can span multiple columns:', () => {
  specify('Header cells', () => {
    const markup = `
Chart:

                     Director;;;

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new Up.PlainText('Director')], 3)
          ]), [
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Takashi Tokita')]),
              new Table.Row.Cell([new Up.PlainText('Yoshinori Kitase')]),
              new Table.Row.Cell([new Up.PlainText('Akihiko Matsui')])
            ], new Table.Header.Cell([new Up.PlainText('Chrono Trigger')]))
          ])
      ]))
  })

  specify('Row cells', () => {
    const markup = `
Chart:

                    Developer;            Publisher;        Marketer;       Release Date

Chrono Trigger;     Square;;;                                               March 11, 1995
Terranigma;         Quintet;              Nintendo;         Quintet;        October 20, 1995
Command & Conquer;  Westwood Studios;;;                                     August 31, 1995
Starcraft;          Blizzard;;;                                             March 31, 1998`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new Up.PlainText('Developer')]),
            new Table.Header.Cell([new Up.PlainText('Publisher')]),
            new Table.Header.Cell([new Up.PlainText('Marketer')]),
            new Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Square')], 3),
              new Table.Row.Cell([new Up.PlainText('March 11, 1995')])
            ], new Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Table.Row.Cell([new Up.PlainText('October 20, 1995')])
            ], new Table.Header.Cell([new Up.PlainText('Terranigma')])),
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Westwood Studios')], 3),
              new Table.Row.Cell([new Up.PlainText('August 31, 1995')])
            ], new Table.Header.Cell([new Up.PlainText('Command & Conquer')])),
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Blizzard')], 3),
              new Table.Row.Cell([new Up.PlainText('March 31, 1998')])
            ], new Table.Header.Cell([new Up.PlainText('Starcraft')]))
          ])
      ]))
  })

  specify('Row header cells', () => {
    const markup = `
Chart: Summary of last work week

              Most Common Word;         Magical Happenings

Monday;;                                Pikachu evolved
Tuesday;;                               Break room destroyed by Psionic Storm
Wednesday;;                             Break room repaired by CSV
Thursday;     Really;                   Todd finished his work
Friday;;                                Printer had ink`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new Up.PlainText('Most Common Word')]),
            new Table.Header.Cell([new Up.PlainText('Magical Happenings')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Pikachu evolved')])
            ], new Table.Header.Cell([new Up.PlainText('Monday')], 2)),
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Break room destroyed by Psionic Storm')])
            ], new Table.Header.Cell([new Up.PlainText('Tuesday')], 2)),
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Break room repaired by CSV')])
            ], new Table.Header.Cell([new Up.PlainText('Wednesday')], 2)),
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Really')]),
              new Table.Row.Cell([new Up.PlainText('Todd finished his work')])
            ], new Table.Header.Cell([new Up.PlainText('Thursday')])),
            new Table.Row([
              new Table.Row.Cell([new Up.PlainText('Printer had ink')])
            ], new Table.Header.Cell([new Up.PlainText('Friday')], 2)),
          ],
          new Table.Caption([
            new Up.PlainText('Summary of last work week')
          ]))
      ]))
  })
})
