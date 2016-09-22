import { expect } from 'chai'
import * as Up from '../../../../index'


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
            new Up.Table.Header.Cell([new Up.Text('Game')], 1),
            new Up.Table.Header.Cell([new Up.Text('Release Date')], 1)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy')], 1),
              new Up.Table.Row.Cell([new Up.Text('1987')], 1)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')], 1),
              new Up.Table.Row.Cell([new Up.Text('1988')], 1)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')], 1),
              new Up.Table.Row.Cell([new Up.Text('1995')], 1)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')], 1),
              new Up.Table.Row.Cell([new Up.Text('1999')], 1)
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')], 2),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('Enix')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Director')], 3),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Takashi Tokita')]),
              new Up.Table.Row.Cell([new Up.Text('Yoshinori Kitase')]),
              new Up.Table.Row.Cell([new Up.Text('Akihiko Matsui')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')], 2),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')], 2),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')], 2),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')]),
            new Up.Table.Header.Cell([new Up.Text('Marketer')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')], 3),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')], 3),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')], 3),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')], 2)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('Enix')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Director')], 3)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Takashi Tokita')]),
              new Up.Table.Row.Cell([new Up.Text('Yoshinori Kitase')]),
              new Up.Table.Row.Cell([new Up.Text('Akihiko Matsui')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')], 2)
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')]),
            new Up.Table.Header.Cell([new Up.Text('Marketer')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')], 3)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')], 3)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')], 3)
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')], 2)
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('Enix')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')], 2)
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')], 2)
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
            new Up.Table.Header.Cell([new Up.Text('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.Text('Squats')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.Text('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.Text('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Swam laps')]),
              new Up.Table.Row.Cell([new Up.Text('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.Text('March 14, 2018')])
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
            new Up.Table.Header.Cell([new Up.Text('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.Text('Squats')]),
              new Up.Table.Row.Cell([new Up.Text('Walked on treadmill')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.Text('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.Text('Walked on track')]),
              new Up.Table.Row.Cell([new Up.Text('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Swam laps')]),
              new Up.Table.Row.Cell([new Up.Text('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.Text('Treaded water')]),
              new Up.Table.Row.Cell([new Up.Text('March 14, 2018')])
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
            new Up.Table.Header.Cell([new Up.Text('Aerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.Text('Anaerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.Text('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.Text('Squats')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.Text('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.Text('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.Text('March 13, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Swam laps')]),
              new Up.Table.Row.Cell([new Up.Text('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.Text('March 14, 2018')])
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
            new Up.Table.Header.Cell([new Up.Text('Aerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.Text('Anaerobic Exercise')]),
            new Up.Table.Header.Cell([new Up.Text('Cooldown')]),
            new Up.Table.Header.Cell([new Up.Text('Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on treadmill')]),
              new Up.Table.Row.Cell([new Up.Text('Squats')]),
              new Up.Table.Row.Cell([new Up.Text('Walked on treadmill')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Jogged on track')]),
              new Up.Table.Row.Cell([new Up.Text('Deadlifts')]),
              new Up.Table.Row.Cell([new Up.Text('Walked on track')]),
              new Up.Table.Row.Cell([new Up.Text('March 12, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([], 3),
              new Up.Table.Row.Cell([new Up.Text('March 13, 2018')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Swam laps')]),
              new Up.Table.Row.Cell([new Up.Text('Sprints on track')]),
              new Up.Table.Row.Cell([new Up.Text('Treaded water')]),
              new Up.Table.Row.Cell([new Up.Text('March 14, 2018')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Director')]),
            new Up.Table.Header.Cell([], 2),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Takashi Tokita')]),
              new Up.Table.Row.Cell([new Up.Text('Yoshinori Kitase')]),
              new Up.Table.Row.Cell([new Up.Text('Akihiko Matsui')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')]),
            new Up.Table.Header.Cell([new Up.Text('Marketer')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')]),
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')]),
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')]),
              new Up.Table.Row.Cell([], 2),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
            ])
          ])
      ]))
  })
})
