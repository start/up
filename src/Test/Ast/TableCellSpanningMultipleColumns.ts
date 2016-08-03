import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('All table header cells and table row cells', () => {
  it('span 1 column by default', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(markup)).to.be.eql(
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


describe('A table header cell terminated by 2 semicolons', () => {
  it('spans 2 columns', () => {
    const markup = `
Table:

Game;               Publisher;;                       Release Date

Terranigma;         Nintendo;             Enix;       October 20, 1995`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')], 2),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Enix')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ])
          ])
      ]))
  })
})


describe('A table header cell terminated by 3 or more semicolons', () => {
  it('spans that many columns', () => {
    const markup = `
Table:

Game;               Director;;;                                             Release Date

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui;   March 11, 1995`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Director')], 3),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Takashi Tokita')]),
              new TableNode.Row.Cell([new PlainTextNode('Yoshinori Kitase')]),
              new TableNode.Row.Cell([new PlainTextNode('Akihiko Matsui')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ])
          ])
      ]))
  })
})


describe('A table row cell terminated by 2 semicolons', () => {
  it('spans 2 columns', () => {
    const markup = `
Table:

Game;               Developer;            Publisher;        Release Date

Chrono Trigger;     Square;;                                March 11, 1995
Terranigma;         Quintet;              Nintendo;         October 20, 1995

Command & Conquer;  Westwood Studios;;                      August 31, 1995
Starcraft;          Blizzard;;                              March 31, 1998`

    expect(Up.toAst(markup)).to.be.eql(
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


describe('A table row cell terminated by 3 or more semicolons', () => {
  it('spans that many columns', () => {
    const markup = `
Table:

Game;               Developer;            Publisher;        Marketer;       Release Date

Chrono Trigger;     Square;;;                                               March 11, 1995
Terranigma;         Quintet;              Nintendo;         Quintet;        October 20, 1995

Command & Conquer;  Westwood Studios;;;                                     August 31, 1995
Starcraft;          Blizzard;;;                                             March 31, 1998`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')]),
            new TableNode.Header.Cell([new PlainTextNode('Marketer')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')], 3),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')]),
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')], 3),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')], 3),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ])
          ])
      ]))
  })
})


context('When the final cell in a table header is terminated by 2 semicolons', () => {
  specify('it spans 2 columns', () => {
    const markup = `
Table:

Game;               Publisher;;

Terranigma;         Nintendo;             Enix`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')], 2)
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Enix')])
            ])
          ])
      ]))
  })
})


context('When the final cell in a table header is terminated by 3 or more semicolons', () => {
  specify('it spans that many columns', () => {
    const markup = `
Table:

Game;               Director;;;

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Director')], 3)
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Takashi Tokita')]),
              new TableNode.Row.Cell([new PlainTextNode('Yoshinori Kitase')]),
              new TableNode.Row.Cell([new PlainTextNode('Akihiko Matsui')])
            ])
          ])
      ]))
  })
})


context('When the final cell in a table row cell is terminated by 2 semicolons', () => {
  specify('it spans 2 columns', () => {
    const markup = `
Table:

Game;               Developer;            Publisher

Chrono Trigger;     Square;;
Terranigma;         Quintet;              Nintendo

Command & Conquer;  Westwood Studios;;
Starcraft;          Blizzard;;`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')], 2)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')]),
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')], 2)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')], 2)
            ])
          ])
      ]))
  })
})


context('When the final cell in a table row cell is terminated by 3 or more semicolons', () => {
  specify('it spans that many columns', () => {
    const markup = `
Table:

Game;               Developer;            Publisher;      Marketer

Chrono Trigger;     Square;;;
Terranigma;         Quintet;              Nintendo;       Quintet

Command & Conquer;  Westwood Studios;;;
Starcraft;          Blizzard;;;`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')]),
            new TableNode.Header.Cell([new PlainTextNode('Marketer')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')], 3)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')]),
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')], 3)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')], 3)
            ])
          ])
      ]))
  })
})


context('When the final cell in a table header is terminated by 2 semicolons followed by whitespace', () => {
  specify('it spans 2 columns', () => {
    const markup = `
Table:

Game;               Publisher;; \t \t

Terranigma;         Nintendo;             Enix`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')], 2)
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Enix')])
            ])
          ])
      ]))
  })
})


context('When the final cell in a table row cell is terminated by 2 semicolons followed by whitespace', () => {
  specify('it spans 2 columns', () => {
    const markup = `
Table:

Game;               Developer;            Publisher

Chrono Trigger;     Square;; \t \t
Terranigma;         Quintet;  \t \t       Nintendo

Command & Conquer;  Westwood Studios;;
Starcraft;          Blizzard;; \t \t`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')], 2)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')]),
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')], 2)
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')], 2)
            ])
          ])
      ]))
  })
})


context('A table header starting with 2 semicolons', () => {
  it('starts with an empty cell spanning 2 columns', () => {
    const markup = `
Table:

;;                                                  Date

Jogged on treadmill;      Squats;                   March 11, 2018
Jogged on track;          Deadlifts;                March 12, 2018
Swam laps;                Sprints on track;         March 14, 2018`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([], 2),
            new TableNode.Header.Cell([new PlainTextNode('Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on treadmill')]),
              new TableNode.Row.Cell([new PlainTextNode('Squats')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on track')]),
              new TableNode.Row.Cell([new PlainTextNode('Deadlifts')]),
              new TableNode.Row.Cell([new PlainTextNode('March 12, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Swam laps')]),
              new TableNode.Row.Cell([new PlainTextNode('Sprints on track')]),
              new TableNode.Row.Cell([new PlainTextNode('March 14, 2018')])
            ])
          ])
      ]))
  })
})


context('A table header starting with 3 or more semicolons', () => {
  it('starts with an empty cell spanning that many columns', () => {
    const markup = `
Table:

;;;                                                                       Date

Jogged on treadmill;      Squats;             Walked on treadmill;        March 11, 2018
Jogged on track;          Deadlifts;          Walked on track;            March 12, 2018
Swam laps;                Sprints on track;   Treaded water;              March 14, 2018`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([], 3),
            new TableNode.Header.Cell([new PlainTextNode('Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on treadmill')]),
              new TableNode.Row.Cell([new PlainTextNode('Squats')]),
              new TableNode.Row.Cell([new PlainTextNode('Walked on treadmill')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on track')]),
              new TableNode.Row.Cell([new PlainTextNode('Deadlifts')]),
              new TableNode.Row.Cell([new PlainTextNode('Walked on track')]),
              new TableNode.Row.Cell([new PlainTextNode('March 12, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Swam laps')]),
              new TableNode.Row.Cell([new PlainTextNode('Sprints on track')]),
              new TableNode.Row.Cell([new PlainTextNode('Treaded water')]),
              new TableNode.Row.Cell([new PlainTextNode('March 14, 2018')])
            ])
          ])
      ]))
  })
})


context('A table row starting with 2 semicolons', () => {
  it('starts with an empty cell spanning 2 columns', () => {
    const markup = `
Table:

Aerobic Exercise;         Anaerobic Exercise;        Date

Jogged on treadmill;      Squats;                   March 11, 2018
Jogged on track;          Deadlifts;                March 12, 2018
;;                                                  March 13, 2018
Swam laps;                Sprints on track;         March 14, 2018`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Aerobic Exercise')]),
            new TableNode.Header.Cell([new PlainTextNode('Anaerobic Exercise')]),
            new TableNode.Header.Cell([new PlainTextNode('Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on treadmill')]),
              new TableNode.Row.Cell([new PlainTextNode('Squats')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on track')]),
              new TableNode.Row.Cell([new PlainTextNode('Deadlifts')]),
              new TableNode.Row.Cell([new PlainTextNode('March 12, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([], 2),
              new TableNode.Row.Cell([new PlainTextNode('March 13, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Swam laps')]),
              new TableNode.Row.Cell([new PlainTextNode('Sprints on track')]),
              new TableNode.Row.Cell([new PlainTextNode('March 14, 2018')])
            ])
          ])
      ]))
  })
})


context('A table row starting with 3 or more semicolons', () => {
  it('starts with an empty cell spanning that many columns', () => {
    const markup = `
Table:

Aerobic Exercise;         Anaerobic Exercise;   Cooldown;                   Date

Jogged on treadmill;      Squats;               Walked on treadmill;        March 11, 2018
Jogged on track;          Deadlifts;            Walked on track;            March 12, 2018
;;;                                                                         March 13, 2018
Swam laps;                Sprints on track;     Treaded water;              March 14, 2018`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Aerobic Exercise')]),
            new TableNode.Header.Cell([new PlainTextNode('Anaerobic Exercise')]),
            new TableNode.Header.Cell([new PlainTextNode('Cooldown')]),
            new TableNode.Header.Cell([new PlainTextNode('Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on treadmill')]),
              new TableNode.Row.Cell([new PlainTextNode('Squats')]),
              new TableNode.Row.Cell([new PlainTextNode('Walked on treadmill')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Jogged on track')]),
              new TableNode.Row.Cell([new PlainTextNode('Deadlifts')]),
              new TableNode.Row.Cell([new PlainTextNode('Walked on track')]),
              new TableNode.Row.Cell([new PlainTextNode('March 12, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([], 3),
              new TableNode.Row.Cell([new PlainTextNode('March 13, 2018')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Swam laps')]),
              new TableNode.Row.Cell([new PlainTextNode('Sprints on track')]),
              new TableNode.Row.Cell([new PlainTextNode('Treaded water')]),
              new TableNode.Row.Cell([new PlainTextNode('March 14, 2018')])
            ])
          ])
      ]))
  })
})


describe('Empty table header cells', () => {
  it('can span multiple columns', () => {
    const markup = `
Table:

Game;               Director;         ;;                                    Release Date

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui;   March 11, 1995`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Director')]),
            new TableNode.Header.Cell([], 2),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Takashi Tokita')]),
              new TableNode.Row.Cell([new PlainTextNode('Yoshinori Kitase')]),
              new TableNode.Row.Cell([new PlainTextNode('Akihiko Matsui')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ])
          ])
      ]))
  })
})


describe('Empty table row cells', () => {
  it('can span multiple columns', () => {
    const markup = `
Table:

Game;               Developer;            Publisher;        Marketer;       Release Date

Chrono Trigger;     Square;                                 ;;              March 11, 1995
Terranigma;         Quintet;              Nintendo;         Quintet;        October 20, 1995

Command & Conquer;  Westwood Studios;                       ;;              August 31, 1995
Starcraft;          Blizzard;                               ;;                March 31, 1998`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')]),
            new TableNode.Header.Cell([new PlainTextNode('Marketer')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')]),
              new TableNode.Row.Cell([], 2),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')]),
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')]),
              new TableNode.Row.Cell([], 2),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')]),
              new TableNode.Row.Cell([], 2),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ])
          ])
      ]))
  })
})
