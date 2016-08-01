import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('A chart with one column', () => {
  it('has that column interpreted as a vertical heading', () => {
    const text = `
Chart: Magical happenings this past work week

            Magical Happenings

Monday
Tuesday
Wednesday
Thursday
Friday`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Magical Happenings')])
          ]), [
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Monday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Tuesday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Wednesday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Thursday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Friday')]))
          ],
          new TableNode.Caption([
            new PlainTextNode('Magical happenings this past work week')
          ]))
      ]))
  })

  it('can habe row header cells that would otherwise be interpreted as section separator streaks', () => {
    const text = `
Chart: Most common underlines for top-level headings (from most to least common)

      Underline Frequency

====
####
----`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
              [], new TableNode.Header.Cell([new PlainTextNode('----')]))
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


describe("A chart header cell", () => {
  it('can end with an escaped semicolon', () => {
    const text = `
Chart

                     Release Date [\\;
Chrono Trigger;      1995
Chrono Cross;        1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Chart

                      Release Date :\\\\
Chrono Trigger;       1995
Chrono Cross;         1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Chart

                     Release Date
Chrono Trigger [\\;; 1995
Chrono Cross;        1999 [\\;`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Chart

                      Release Date
Chrono Trigger :\\\\; 1995
Chrono Cross;         1999 :\\\\`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Chart: my favorite outline convention.


I almost didn't include them; however, I realized charts are too useful to leave out.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Chart: my favorite outline convention.')]),
        new ParagraphNode([new PlainTextNode("I almost didn't include them; however, I realized charts are too useful to leave out.")]),
      ]))
  })
})
