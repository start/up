import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('Just like in a table, cells in a chart can span multiple columns. The syntax is the same. Any chart cell can span multiple columns:', () => {
  specify('Header cells', () => {
    const markup = `
Chart:

                     Director;;;

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Director')], 3)
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Takashi Tokita')]),
              new TableNode.Row.Cell([new PlainTextNode('Yoshinori Kitase')]),
              new TableNode.Row.Cell([new PlainTextNode('Akihiko Matsui')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')]))
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

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')]),
            new TableNode.Header.Cell([new PlainTextNode('Marketer')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Square')], 3),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Terranigma')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')], 3),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Command & Conquer')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')], 3),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ], new TableNode.Header.Cell([new PlainTextNode('Starcraft')]))
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

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Most Common Word')]),
            new TableNode.Header.Cell([new PlainTextNode('Magical Happenings')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Pikachu evolved')])
            ], new TableNode.Header.Cell([new PlainTextNode('Monday')], 2)),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Break room destroyed by Psionic Storm')])
            ], new TableNode.Header.Cell([new PlainTextNode('Tuesday')], 2)),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Break room repaired by CSV')])
            ], new TableNode.Header.Cell([new PlainTextNode('Wednesday')], 2)),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Really')]),
              new TableNode.Row.Cell([new PlainTextNode('Todd finished his work')])
            ], new TableNode.Header.Cell([new PlainTextNode('Thursday')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Printer had ink')])
            ], new TableNode.Header.Cell([new PlainTextNode('Friday')], 2)),
          ],
          new TableNode.Caption([
            new PlainTextNode('Summary of last work week')
          ]))
      ]))
  })
})
