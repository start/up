import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('When a table row has fewer cells than the header', () => {
  specify('no extra cells are added to that row', () => {
    const text = `
Table:

Game;               Developer;            Platform;         Release Date

Chrono Trigger;     Square
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ])
          ])
      ]))
  })
})