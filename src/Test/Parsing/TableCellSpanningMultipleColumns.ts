import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Table } from '../../SyntaxNodes/Table'
import { PlainText } from '../../SyntaxNodes/PlainText'


describe('All table header cells and table row cells', () => {
  it('span 1 column by default', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')], 1),
            new Table.Header.Cell([new PlainText('Release Date')], 1)
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')], 1),
              new Table.Row.Cell([new PlainText('1987')], 1)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')], 1),
              new Table.Row.Cell([new PlainText('1988')], 1)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')], 1),
              new Table.Row.Cell([new PlainText('1995')], 1)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')], 1),
              new Table.Row.Cell([new PlainText('1999')], 1)
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Publisher')], 2),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('Enix')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Director')], 3),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Takashi Tokita')]),
              new Table.Row.Cell([new PlainText('Yoshinori Kitase')]),
              new Table.Row.Cell([new PlainText('Akihiko Matsui')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Publisher')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')], 2),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')], 2),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
              new Table.Row.Cell([new PlainText('Blizzard')], 2),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Publisher')]),
            new Table.Header.Cell([new PlainText('Marketer')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')], 3),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')], 3),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
              new Table.Row.Cell([new PlainText('Blizzard')], 3),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Publisher')], 2)
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('Enix')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Director')], 3)
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Takashi Tokita')]),
              new Table.Row.Cell([new PlainText('Yoshinori Kitase')]),
              new Table.Row.Cell([new PlainText('Akihiko Matsui')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Publisher')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')], 2)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Nintendo')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')], 2)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
              new Table.Row.Cell([new PlainText('Blizzard')], 2)
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Publisher')]),
            new Table.Header.Cell([new PlainText('Marketer')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')], 3)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('Quintet')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')], 3)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
              new Table.Row.Cell([new PlainText('Blizzard')], 3)
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Publisher')], 2)
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('Enix')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Publisher')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')], 2)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Nintendo')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')], 2)
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
              new Table.Row.Cell([new PlainText('Blizzard')], 2)
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([], 2),
            new Table.Header.Cell([new PlainText('Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on treadmill')]),
              new Table.Row.Cell([new PlainText('Squats')]),
              new Table.Row.Cell([new PlainText('March 11, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on track')]),
              new Table.Row.Cell([new PlainText('Deadlifts')]),
              new Table.Row.Cell([new PlainText('March 12, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Swam laps')]),
              new Table.Row.Cell([new PlainText('Sprints on track')]),
              new Table.Row.Cell([new PlainText('March 14, 2018')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([], 3),
            new Table.Header.Cell([new PlainText('Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on treadmill')]),
              new Table.Row.Cell([new PlainText('Squats')]),
              new Table.Row.Cell([new PlainText('Walked on treadmill')]),
              new Table.Row.Cell([new PlainText('March 11, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on track')]),
              new Table.Row.Cell([new PlainText('Deadlifts')]),
              new Table.Row.Cell([new PlainText('Walked on track')]),
              new Table.Row.Cell([new PlainText('March 12, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Swam laps')]),
              new Table.Row.Cell([new PlainText('Sprints on track')]),
              new Table.Row.Cell([new PlainText('Treaded water')]),
              new Table.Row.Cell([new PlainText('March 14, 2018')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Aerobic Exercise')]),
            new Table.Header.Cell([new PlainText('Anaerobic Exercise')]),
            new Table.Header.Cell([new PlainText('Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on treadmill')]),
              new Table.Row.Cell([new PlainText('Squats')]),
              new Table.Row.Cell([new PlainText('March 11, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on track')]),
              new Table.Row.Cell([new PlainText('Deadlifts')]),
              new Table.Row.Cell([new PlainText('March 12, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([], 2),
              new Table.Row.Cell([new PlainText('March 13, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Swam laps')]),
              new Table.Row.Cell([new PlainText('Sprints on track')]),
              new Table.Row.Cell([new PlainText('March 14, 2018')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Aerobic Exercise')]),
            new Table.Header.Cell([new PlainText('Anaerobic Exercise')]),
            new Table.Header.Cell([new PlainText('Cooldown')]),
            new Table.Header.Cell([new PlainText('Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on treadmill')]),
              new Table.Row.Cell([new PlainText('Squats')]),
              new Table.Row.Cell([new PlainText('Walked on treadmill')]),
              new Table.Row.Cell([new PlainText('March 11, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Jogged on track')]),
              new Table.Row.Cell([new PlainText('Deadlifts')]),
              new Table.Row.Cell([new PlainText('Walked on track')]),
              new Table.Row.Cell([new PlainText('March 12, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([], 3),
              new Table.Row.Cell([new PlainText('March 13, 2018')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Swam laps')]),
              new Table.Row.Cell([new PlainText('Sprints on track')]),
              new Table.Row.Cell([new PlainText('Treaded water')]),
              new Table.Row.Cell([new PlainText('March 14, 2018')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Director')]),
            new Table.Header.Cell([], 2),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Takashi Tokita')]),
              new Table.Row.Cell([new PlainText('Yoshinori Kitase')]),
              new Table.Row.Cell([new PlainText('Akihiko Matsui')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Publisher')]),
            new Table.Header.Cell([new PlainText('Marketer')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')]),
              new Table.Row.Cell([], 2),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Nintendo')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')]),
              new Table.Row.Cell([], 2),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
              new Table.Row.Cell([new PlainText('Blizzard')]),
              new Table.Row.Cell([], 2),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
            ])
          ])
      ]))
  })
})
