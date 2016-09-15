import { expect } from 'chai'
import Up = require('../../../index')


describe("A chart header cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Chart

                     Release Date [\\;
Chrono Trigger;      1995
Chrono Cross;        1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date [;')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')])),
          ])
      ]))
  })

  it('can end with an escaped backslash', () => {
    const markup = `
Chart

                      Release Date :\\\\
Chrono Trigger;       1995
Chrono Cross;         1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date :\\')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')])),
          ])
      ]))
  })
})


describe("A chart row cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Chart

                     Release Date
Chrono Trigger [\\;; 1995
Chrono Cross;        1999 [\\;`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger [;')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999 [;')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')])),
          ])
      ]))
  })

  it('can end with an escaped backslash', () => {
    const markup = `
Chart

                      Release Date
Chrono Trigger :\\\\; 1995
Chrono Cross;         1999 :\\\\`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger :\\')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999 :\\')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')])),
          ])
      ]))
  })
})


context("A chart's label line", () => {
  specify('cannot be followed by two or more blank lines', () => {
    const markup = `
Chart: my favorite outline convention.


I almost didn't include them; however, I realized charts are too useful to leave out.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText('Chart: my favorite outline convention.')]),
        new Up.Paragraph([new Up.PlainText("I almost didn't include them; however, I realized charts are too useful to leave out.")]),
      ]))
  })
})


describe("A chart's header row", () => {
  it('cannot be followed by two or more blank lines', () => {
    const markup = `
Chart: Good games on the Sega Genesis

        Release Date


I'm not biased; instead, I simply recognize Nintendo is completely flawless.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]),
          [],
          new Up.Table.Caption([
            new Up.PlainText('Good games on the Sega Genesis')
          ])),
        new Up.Paragraph([
          new Up.PlainText("I'm not biased; instead, I simply recognize Nintendo is completely flawless.")
        ])
      ]))
  })
})


describe('A chart with one column', () => {
  it('can contain row header cells that would otherwise be interpreted as thematic break streaks, assuming the streaks have no special inline role (e.g. multiple dashes)', () => {
    const markup = `
Chart: Most common underlines for top-level headings (from most to least common)

      Underline Frequency

====
####
****`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Underline Frequency')])
          ]), [
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('====')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('####')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('****')]))
          ],
          new Up.Table.Caption([
            new Up.PlainText('Most common underlines for top-level headings '),
            new Up.NormalParenthetical([
              new Up.PlainText('(from most to least common)')
            ])
          ]))
      ]))
  })
})


context("Outline conventions are evaluated before inline conventions, so chart cells' delimiters are evaluated before their inline contents.", () => {
  context('Inline code delimiters do not interfere with delimiters for', () => {
    specify('Header cells', () => {
      const markup = `
Chart

                    Game\`s Platform;       Game\`s Release Date
Chrono Trigger;     Super NES;              1995
Chrono Cross;       Playstation;            1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.PlainText('Game`s Platform')]),
              new Up.Table.Header.Cell([new Up.PlainText('Game`s Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Super NES')]),
                new Up.Table.Row.Cell([new Up.PlainText('1995')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Playstation')]),
                new Up.Table.Row.Cell([new Up.PlainText('1999')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row cells', () => {
      const markup = `
Chart

                    Platform;                 Release Decade
Chrono Trigger;     Nintendo\`s Super NES;    1990\`s
Chrono Cross;       Sony\`s Playstation;      1990\`s`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Decade')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Nintendo\`s Super NES')]),
                new Up.Table.Row.Cell([new Up.PlainText('1990`s')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Sony\`s Playstation')]),
                new Up.Table.Row.Cell([new Up.PlainText('1990`s')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row header cells', () => {
      const markup = `
Chart

                              Platform;         Release Decade
Square\`s Chrono Trigger;     Super NES;        1990\`s
Square\s Chrono Cross;        Playstation;      1990\`s`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Decade')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Super NES')]),
                new Up.Table.Row.Cell([new Up.PlainText('1990`s')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Square\`s Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Playstation')]),
                new Up.Table.Row.Cell([new Up.PlainText('1990`s')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Square\s Chrono Cross')]))
            ])
        ]))
    })
  })


  context('Delimiters for example input do not interfere with', () => {
    specify('Header cells', () => {
      const markup = `
Chart:

                  {: Platform;          Release Date :}
Chrono Trigger;   Super Nintendo;       1995
Chrono Cross;     Playstation;          1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.PlainText('{: Platform')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Date :}')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
                new Up.Table.Row.Cell([new Up.PlainText('1995')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Playstation')]),
                new Up.Table.Row.Cell([new Up.PlainText('1999')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row cells', () => {
      const markup = `
Chart:

                  Platform;           Release Date
Chrono Trigger;   Super Nintendo;     1995
Chrono Cross;     {: Playstation;     1999 :}`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
                new Up.Table.Row.Cell([new Up.PlainText('1995')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('{: Playstation')]),
                new Up.Table.Row.Cell([new Up.PlainText('1999 :}')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row header cells', () => {
      const markup = `
Chart:

                      Platform;            Release Date
{: Chrono Trigger;    Super :} Nintendo;   1995
Chrono Cross;         Playstation;         1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Super :} Nintendo')]),
                new Up.Table.Row.Cell([new Up.PlainText('1995')])
              ], new Up.Table.Header.Cell([new Up.PlainText('{: Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Playstation')]),
                new Up.Table.Row.Cell([new Up.PlainText('1999')])
              ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
            ])
        ]))
    })
  })
})
