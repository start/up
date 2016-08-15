import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('Just like a table, when a chart row has fewer cells than the header or than other rows', () => {
  specify('no extra cells are added to that row', () => {
    const markup = `
Chart:

                    Developer;            Platform;         Release Date

Chrono Trigger;     Square
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Square')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Terranigma')])),
            new TableNode.Row([], new TableNode.Header.Cell([new PlainTextNode('Command & Conquer')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ], new TableNode.Header.Cell([new PlainTextNode('Starcraft')]))
          ])
      ]))
  })
})


describe('A chart header', () => {
  specify('can have fewer cells than its rows have', () => {
    const markup = `
Chart:

                    Release Date

Final Fantasy;      1987;               This game has some interesting bugs.
Chrono Cross;       1999;               Though not a proper sequel, it's my favorite game.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')]),
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
              new TableNode.Row.Cell([new PlainTextNode('This game has some interesting bugs.')])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
              new TableNode.Row.Cell([new PlainTextNode("Though not a proper sequel, it's my favorite game.")])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })
})
