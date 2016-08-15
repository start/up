import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe("A chart header cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Chart

                     Release Date [\\;
Chrono Trigger;      1995
Chrono Cross;        1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date [;')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date :\\')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger [;')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999 [;')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger :\\')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999 :\\')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
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
        new ParagraphNode([new PlainTextNode('Chart: my favorite outline convention.')]),
        new ParagraphNode([new PlainTextNode("I almost didn't include them; however, I realized charts are too useful to leave out.")]),
      ]))
  })
})


describe('A chart with one column', () => {
  it('can contain row header cells that would otherwise be interpreted as outline separator streaks, assuming the streaks have no special inline meaning (e.g. multiple dashes)', () => {
    const markup = `
Chart: Most common underlines for top-level headings (from most to least common)

      Underline Frequency

====
####
****`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Underline Frequency')])
          ]), [
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('====')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('####')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('****')]))
          ],
          new TableNode.Caption([
            new PlainTextNode('Most common underlines for top-level headings '),
            new ParenthesizedNode([
              new PlainTextNode('(from most to least common)')
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
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('Game`s Platform')]),
              new TableNode.Header.Cell([new PlainTextNode('Game`s Release Date')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Super NES')]),
                new TableNode.Row.Cell([new PlainTextNode('1995')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Playstation')]),
                new TableNode.Row.Cell([new PlainTextNode('1999')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
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
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('Platform')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Decade')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Nintendo\`s Super NES')]),
                new TableNode.Row.Cell([new PlainTextNode('1990`s')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Sony\`s Playstation')]),
                new TableNode.Row.Cell([new PlainTextNode('1990`s')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
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
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('Platform')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Decade')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Super NES')]),
                new TableNode.Row.Cell([new PlainTextNode('1990`s')])
              ], new TableNode.Header.Cell([new PlainTextNode('Square\`s Chrono Trigger')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Playstation')]),
                new TableNode.Row.Cell([new PlainTextNode('1990`s')])
              ], new TableNode.Header.Cell([new PlainTextNode('Square\s Chrono Cross')]))
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
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('{: Platform')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Date :}')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
                new TableNode.Row.Cell([new PlainTextNode('1995')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Playstation')]),
                new TableNode.Row.Cell([new PlainTextNode('1999')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
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
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('Platform')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Date')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
                new TableNode.Row.Cell([new PlainTextNode('1995')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('{: Playstation')]),
                new TableNode.Row.Cell([new PlainTextNode('1999 :}')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
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
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('Platform')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Date')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Super :} Nintendo')]),
                new TableNode.Row.Cell([new PlainTextNode('1995')])
              ], new TableNode.Header.Cell([new PlainTextNode('{: Chrono Trigger')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Playstation')]),
                new TableNode.Row.Cell([new PlainTextNode('1999')])
              ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
            ])
        ]))
    })
  })
})
