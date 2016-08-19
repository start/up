import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Table } from '../../SyntaxNodes/Table'
import { PlainText } from '../../SyntaxNodes/PlainText'


context('Just like in a table, cells in a chart can span multiple columns. The syntax is the same. Any chart cell can span multiple columns:', () => {
  specify('Header cells', () => {
    const markup = `
Chart:

                     Director;;;

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Director')], 3)
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Takashi Tokita')]),
              new Table.Row.Cell([new PlainText('Yoshinori Kitase')]),
              new Table.Row.Cell([new PlainText('Akihiko Matsui')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')]))
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Publisher')]),
            new Table.Header.Cell([new PlainText('Marketer')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Square')], 3),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ], new Table.Header.Cell([new PlainText('Terranigma')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Westwood Studios')], 3),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
            ], new Table.Header.Cell([new PlainText('Command & Conquer')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Blizzard')], 3),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
            ], new Table.Header.Cell([new PlainText('Starcraft')]))
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Most Common Word')]),
            new Table.Header.Cell([new PlainText('Magical Happenings')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Pikachu evolved')])
            ], new Table.Header.Cell([new PlainText('Monday')], 2)),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Break room destroyed by Psionic Storm')])
            ], new Table.Header.Cell([new PlainText('Tuesday')], 2)),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Break room repaired by CSV')])
            ], new Table.Header.Cell([new PlainText('Wednesday')], 2)),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Really')]),
              new Table.Row.Cell([new PlainText('Todd finished his work')])
            ], new Table.Header.Cell([new PlainText('Thursday')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Printer had ink')])
            ], new Table.Header.Cell([new PlainText('Friday')], 2)),
          ],
          new Table.Caption([
            new PlainText('Summary of last work week')
          ]))
      ]))
  })
})
