import { expect } from 'chai'
import Up = require('../../index')


describe('All table header cells and table row cells', () => {
  it('span 1 column by default', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;   1988
Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')], 1),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')], 1)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')], 1),
              new Up.Table.Row.Cell([new Up.PlainText('1987')], 1)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')], 1),
              new Up.Table.Row.Cell([new Up.PlainText('1988')], 1)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')], 1),
              new Up.Table.Row.Cell([new Up.PlainText('1995')], 1)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')], 1),
              new Up.Table.Row.Cell([new Up.PlainText('1999')], 1)
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')], 2),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('Enix')]),
              new Up.Table.Row.Cell([new Up.PlainText('October 20, 1995')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Director')], 3),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Takashi Tokita')]),
              new Up.Table.Row.Cell([new Up.PlainText('Yoshinori Kitase')]),
              new Up.Table.Row.Cell([new Up.PlainText('Akihiko Matsui')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 1995')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')], 2),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')], 2),
              new Up.Table.Row.Cell([new Up.PlainText('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')], 2),
              new Up.Table.Row.Cell([new Up.PlainText('March 31, 1998')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')]),
            new Up.Table.Header.Cell([new Up.PlainText('Marketer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')], 3),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')], 3),
              new Up.Table.Row.Cell([new Up.PlainText('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')], 3),
              new Up.Table.Row.Cell([new Up.PlainText('March 31, 1998')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')], 2)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('Enix')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Director')], 3)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Takashi Tokita')]),
              new Up.Table.Row.Cell([new Up.PlainText('Yoshinori Kitase')]),
              new Up.Table.Row.Cell([new Up.PlainText('Akihiko Matsui')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')], 2)
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')]),
            new Up.Table.Header.Cell([new Up.PlainText('Marketer')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')], 3)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')], 3)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')], 3)
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')], 2)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('Enix')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')], 2)
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([], 2),
            new Up.Table.Header.Cell([new Up.PlainText('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.PlainText('Squats')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Swam laps')]),
              new Up.Table.Row.Cell([new Up.PlainText('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 14, 2018')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([], 3),
            new Up.Table.Header.Cell([new Up.PlainText('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.PlainText('Squats')]),
              new Up.Table.Row.Cell([new Up.PlainText('Walked on treadmill')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.PlainText('Walked on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Swam laps')]),
              new Up.Table.Row.Cell([new Up.PlainText('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('Treaded water')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 14, 2018')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Aerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.PlainText('Anaerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.PlainText('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.PlainText('Squats')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.PlainText('March 13, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Swam laps')]),
              new Up.Table.Row.Cell([new Up.PlainText('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 14, 2018')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Aerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.PlainText('Anaerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.PlainText('Cooldown')]),
            new Up.Table.Header.Cell([new Up.PlainText('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.PlainText('Squats')]),
              new Up.Table.Row.Cell([new Up.PlainText('Walked on treadmill')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.PlainText('Walked on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([], 3),
              new Up.Table.Row.Cell([new Up.PlainText('March 13, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Swam laps')]),
              new Up.Table.Row.Cell([new Up.PlainText('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.PlainText('Treaded water')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 14, 2018')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Director')]),
            new Up.Table.Header.Cell([], 2),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Takashi Tokita')]),
              new Up.Table.Row.Cell([new Up.PlainText('Yoshinori Kitase')]),
              new Up.Table.Row.Cell([new Up.PlainText('Akihiko Matsui')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 1995')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')]),
            new Up.Table.Header.Cell([new Up.PlainText('Marketer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')]),
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')]),
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.PlainText('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')]),
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.PlainText('March 31, 1998')])
            ])
          ])
      ]))
  })
})
