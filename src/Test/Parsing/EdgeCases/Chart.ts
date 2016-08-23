import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Table } from '../../../SyntaxNodes/Table'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe("A chart header cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Chart

                     Release Date [\\;
Chrono Trigger;      1995
Chrono Cross;        1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date [;')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
          ])
      ]))
  })

  it('can end with an escaped backslash', () => {
    const markup = `
Chart

                      Release Date :\\\\
Chrono Trigger;       1995
Chrono Cross;         1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date :\\')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger [;')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999 [;')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
          ])
      ]))
  })

  it('can end with an escaped backslash', () => {
    const markup = `
Chart

                      Release Date
Chrono Trigger :\\\\; 1995
Chrono Cross;         1999 :\\\\`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger :\\')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999 :\\')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
          ])
      ]))
  })
})


context("A chart's label line", () => {
  specify('cannot be followed by two or more blank lines', () => {
    const markup = `
Chart: my favorite outline convention.


I almost didn't include them; however, I realized charts are too useful to leave out.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText('Chart: my favorite outline convention.')]),
        new Paragraph([new PlainText("I almost didn't include them; however, I realized charts are too useful to leave out.")]),
      ]))
  })
})


describe('A chart with one column', () => {
  it('can contain row header cells that would otherwise be interpreted as thematic break streaks, assuming the streaks have no special inline meaning (e.g. multiple dashes)', () => {
    const markup = `
Chart: Most common underlines for top-level headings (from most to least common)

      Underline Frequency

====
####
****`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Underline Frequency')])
          ]), [
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('====')])),
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('####')])),
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('****')]))
          ],
          new Table.Caption([
            new PlainText('Most common underlines for top-level headings '),
            new NormalParenthetical([
              new PlainText('(from most to least common)')
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

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('Game`s Platform')]),
              new Table.Header.Cell([new PlainText('Game`s Release Date')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Super NES')]),
                new Table.Row.Cell([new PlainText('1995')])
              ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Playstation')]),
                new Table.Row.Cell([new PlainText('1999')])
              ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row cells', () => {
      const markup = `
Chart

                    Platform;                 Release Decade
Chrono Trigger;     Nintendo\`s Super NES;    1990\`s
Chrono Cross;       Sony\`s Playstation;      1990\`s`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('Platform')]),
              new Table.Header.Cell([new PlainText('Release Decade')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Nintendo\`s Super NES')]),
                new Table.Row.Cell([new PlainText('1990`s')])
              ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Sony\`s Playstation')]),
                new Table.Row.Cell([new PlainText('1990`s')])
              ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row header cells', () => {
      const markup = `
Chart

                              Platform;         Release Decade
Square\`s Chrono Trigger;     Super NES;        1990\`s
Square\s Chrono Cross;        Playstation;      1990\`s`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('Platform')]),
              new Table.Header.Cell([new PlainText('Release Decade')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Super NES')]),
                new Table.Row.Cell([new PlainText('1990`s')])
              ], new Table.Header.Cell([new PlainText('Square\`s Chrono Trigger')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Playstation')]),
                new Table.Row.Cell([new PlainText('1990`s')])
              ], new Table.Header.Cell([new PlainText('Square\s Chrono Cross')]))
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

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('{: Platform')]),
              new Table.Header.Cell([new PlainText('Release Date :}')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Super Nintendo')]),
                new Table.Row.Cell([new PlainText('1995')])
              ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Playstation')]),
                new Table.Row.Cell([new PlainText('1999')])
              ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row cells', () => {
      const markup = `
Chart:

                  Platform;           Release Date
Chrono Trigger;   Super Nintendo;     1995
Chrono Cross;     {: Playstation;     1999 :}`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('Platform')]),
              new Table.Header.Cell([new PlainText('Release Date')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Super Nintendo')]),
                new Table.Row.Cell([new PlainText('1995')])
              ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('{: Playstation')]),
                new Table.Row.Cell([new PlainText('1999 :}')])
              ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
            ])
        ]))
    })

    specify('Row header cells', () => {
      const markup = `
Chart:

                      Platform;            Release Date
{: Chrono Trigger;    Super :} Nintendo;   1995
Chrono Cross;         Playstation;         1999`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('Platform')]),
              new Table.Header.Cell([new PlainText('Release Date')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Super :} Nintendo')]),
                new Table.Row.Cell([new PlainText('1995')])
              ], new Table.Header.Cell([new PlainText('{: Chrono Trigger')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Playstation')]),
                new Table.Row.Cell([new PlainText('1999')])
              ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
            ])
        ]))
    })
  })
})
