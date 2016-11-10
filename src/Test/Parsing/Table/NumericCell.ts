import { expect } from 'chai'
import * as Up from '../../../Main'

function expectTableCellToBeNumeric(cellMarkup: string): void {
  expectTableCell({
    cellMarkup,
    toBeNumeric: true
  })
}

function expectTableCellNotToBeNumeric(cellMarkup: string): void {
  expectTableCell({
    cellMarkup,
    toBeNumeric: false
  })
}

function expectTableCell(args: { cellMarkup: string, toBeNumeric: boolean }): void {
  const { cellMarkup, toBeNumeric } = args

  // The `isNumeric` method exists on the base `Table.Cell` class, which is extended by
  // both `Table.Row.Cell` and Table.Header.Cell`.
  //
  // It's less complicated to test `isNumeric` on a `Table.Row.Cell`, because if
  // `cellMarkup` is pure whitespace, inserting it into a header cell would give the
  // table a header column.
  const markup = `
Table
Dummy Header Cell
${cellMarkup};`

  expect(isCellNumeric({
    documentStartingWithTable: Up.parse(markup)
  })).to.equal(toBeNumeric)
}

function isCellNumeric(args: { documentStartingWithTable: Up.Document }): boolean {
  const table =
    args.documentStartingWithTable.children[0] as Up.Table

  return table.rows[0].cells[0].isNumeric()
}


context('A table cell is numeric if its text content (ignoring footnotes) contains digits, no letters, no underscores, and no spaces.', () => {
  context('This includes', () => {
    specify('an integer', () => {
      expectTableCellToBeNumeric('1995')
    })

    specify('an emphasized and stressed integer', () => {
      expectTableCellToBeNumeric('***1995***')
    })

    specify('a decimal', () => {
      expectTableCellToBeNumeric('.5')
    })

    specify('an emphasized and stressed integer', () => {
      expectTableCellToBeNumeric('***.5***')
    })

    specify('an emphasized and stressed integer surrounded by whitespace', () => {
      expectTableCellToBeNumeric('  \t \t \t ***.5***  \t \t \t ')
    })

    specify('a percentage', () => {
      expectTableCellToBeNumeric('55%')
    })

    specify('an emphasized and stressed percentage', () => {
      expectTableCellToBeNumeric('***55%***')
    })

    specify('an emphasized and stressed negative percentage', () => {
      expectTableCellToBeNumeric('***-55%***')
    })

    specify('a percentage with the percent sign emphasized and stressed', () => {
      expectTableCellToBeNumeric('99***%***')
    })

    specify('a time of day without the time period part', () => {
      expectTableCellToBeNumeric('15:40')
    })

    specify('an emphasized and stressed time of day', () => {
      expectTableCellToBeNumeric('***15:40***')
    })

    specify('a price', () => {
      expectTableCellToBeNumeric('$13.01')
    })

    specify('an emphasized and stressed price', () => {
      expectTableCellToBeNumeric('***$13.01***')
    })

    specify('a price whose dollar sign is emphasized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    specify('a parenthesized price', () => {
      expectTableCellToBeNumeric('($13.01)')
    })

    specify('a big number with commas grouping digits', () => {
      expectTableCellToBeNumeric('***$2,000,000***')
    })

    specify('a price whose dollar sign is emphasized and stressed', () => {
      expectTableCellToBeNumeric('***$***13.01')
    })

    specify('inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('`10.0`')
    })

    specify('example user input containing a numeric value', () => {
      expectTableCellToBeNumeric('`10800.0`')
    })

    specify('emphasized and stressed inline code containing a numeric value', () => {
      expectTableCellToBeNumeric('***`10.0`***')
    })

    specify('a link to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[$15.40] (example.com/price)')
    })

    specify('an inline revealable convention whose content is numeric', () => {
      expectTableCellToBeNumeric('[NSFW: 80085]')
    })

    specify('a linkified revealable convention to a non-numeric URL whose content is numeric', () => {
      expectTableCellToBeNumeric('[SPOILER: 44.7] (example.com/defense)')
    })

    specify('an integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('2018 [^ It had been delayed since 2016]')
    })

    specify('an emphasized and stressed integer followed by a non-numeric footnote', () => {
      expectTableCellToBeNumeric('****2018**** [^ It had been delayed since 2016]')
    })

    specify('a numeric section link that is not associated with a table of contents entry', () => {
      expectTableCellToBeNumeric('[topic: 1999]')
    })
  })


  context('This excludes', () => {
    specify('a single word without digits', () => {
      expectTableCellNotToBeNumeric('StarCraft')
    })

    specify('a word conaining digits and letters', () => {
      expectTableCellNotToBeNumeric('3D')
    })

    specify('3 periods forming an ellipsis', () => {
      expectTableCellNotToBeNumeric('...')
    })

    specify('a list of numbers separated by whitespace', () => {
      expectTableCellNotToBeNumeric('1 2 3')
    })

    specify('a face with zeros for eyes and an underscore for its mouth', () => {
      expectTableCellNotToBeNumeric('0_0')
    })

    specify('inline code containing a non-numeric value', () => {
      expectTableCellNotToBeNumeric('`<div role="alert">`')
    })

    specify('example user input containing a non-numeric value', () => {
      expectTableCellNotToBeNumeric('{Start}')
    })

    specify('a link to a numeric URL whose content is a non-numeric value', () => {
      expectTableCellNotToBeNumeric('[John] (tel:5555555555)')
    })

    specify('a linkified revealable convention to a numeric URL whose content is a non-numeric value', () => {
      expectTableCellNotToBeNumeric('[SPOILER: John] (tel:5555555555)')
    })

    specify('an image, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[image: 9000] (64.233.160.0/123)')
    })

    specify('an audio convention, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[audio: 9000] (64.233.160.0/123)')
    })

    specify('a video, even with a numeric description and URL', () => {
      expectTableCellNotToBeNumeric('[video: 9000] (64.233.160.0/123)')
    })

    specify('a footnote on its own, even with numeric content', () => {
      expectTableCellNotToBeNumeric('[^ 2017]')
    })

    specify('multiple footnotes on their own, even if all have numeric content', () => {
      expectTableCellNotToBeNumeric('[^ 2017][^ 2018]')
    })

    specify('a non-numeric section link that is not associated with a table of contents entry', () => {
      expectTableCellNotToBeNumeric('[topic: StarCraft]')
    })

    specify('pure whitespace', () => {
      expectTableCellNotToBeNumeric(' \t \t')
    })

    specify('an empty string', () => {
      expectTableCellNotToBeNumeric('')
    })
  })
})


context("When a section link within a table cell is matched with a table of contents entry, the cell can only be numeric if the entry's content is numeric.", () => {
  specify('When the entry is numeric, the cell can be numeric, too', () => {
    const markup = `
Table
Year
[topic: 1999]

1999
====`

    const heading =
      new Up.Heading([new Up.Text('1999')], {
        level: 1,
        titleMarkup: '1999',
        ordinalInTableOfContents: 1
      })

    const document = Up.parse(markup)

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Year')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.SectionLink('1999', heading)])
            ])
          ]),
        heading
      ], new Up.Document.TableOfContents([heading])))

    expect(isCellNumeric({
      documentStartingWithTable: Up.parse(markup)
    })).to.true
  })

  specify('When the entry is non-numeric, the cell cannot be numeric', () => {
    const markup = `
Table
Game
[topic: Chrono Cross]

Chrono Cross
============`

    const heading =
      new Up.Heading([new Up.Text('Chrono Cross')], {
        level: 1,
        titleMarkup: 'Chrono Cross',
        ordinalInTableOfContents: 1
      })

    const document = Up.parse(markup)

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.SectionLink('Chrono Cross', heading)])
            ])
          ]),
        heading
      ], new Up.Document.TableOfContents([heading])))

    expect(isCellNumeric({
      documentStartingWithTable: Up.parse(markup)
    })).to.false
  })


  context("It doesn't strictly matter whether or not the section link's snippet is numeric.", () => {
    specify('A non-numeric snippet can match a numeric heading', () => {
      const markup = `
Table
Year
[topic: *]

*1999*
======`

      const heading =
        new Up.Heading([
          new Up.Emphasis([
            new Up.Text('1999')
          ])
        ], {
            level: 1,
            titleMarkup: '*1999*',
            ordinalInTableOfContents: 1
          })

      const document = Up.parse(markup)

      expect(document).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Year')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.SectionLink('*', heading)])
              ])
            ]),
          heading
        ], new Up.Document.TableOfContents([heading])))

      expect(isCellNumeric({
        documentStartingWithTable: Up.parse(markup)
      })).to.true
    })

    specify('A numeric snippet can match a non-numeric heading', () => {
      const markup = `
Table
Game
[topic: 1999]

Chrono Cross, released in 1999
==============================`

      const heading =
        new Up.Heading([new Up.Text('Chrono Cross, released in 1999')], {
          level: 1,
          titleMarkup: 'Chrono Cross, released in 1999',
          ordinalInTableOfContents: 1
        })

      const document = Up.parse(markup)

      expect(document).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.SectionLink('1999', heading)])
              ])
            ]),
          heading
        ], new Up.Document.TableOfContents([heading])))

      expect(isCellNumeric({
        documentStartingWithTable: Up.parse(markup)
      })).to.false
    })
  })
})
