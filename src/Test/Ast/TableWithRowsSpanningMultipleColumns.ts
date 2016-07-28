import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('All table header cells and table row cells', () => {
  it('span 1 column by default', () => {
    const text = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')], 1),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')], 1)
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')], 1),
              new TableNode.Row.Cell([new PlainTextNode('1987')], 1)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')], 1),
              new TableNode.Row.Cell([new PlainTextNode('1988')], 1)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')], 1),
              new TableNode.Row.Cell([new PlainTextNode('1995')], 1)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')], 1),
              new TableNode.Row.Cell([new PlainTextNode('1999')], 1)
            ]),
          ])
      ]))
  })
})


describe('A table row cell terminated by two semicolons', () => {
  it('spans two columns', () => {
    const text = `
Table:

Game;               Developer;            Publisher;        Release Date

Chrono Trigger;     Square;;                                March 11, 1995
Terranigma;         Quintet;              Nintendo;         October 20, 1995

Command & Conquer;  Westwood Studios;;                      August 31, 1995
Starcraft;          Blizzard;;                              March 31, 1998`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')], 2),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')]),
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')], 2),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')], 2),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ])
          ])
      ]))
  })
})
