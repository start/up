import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Table } from '../../../SyntaxNodes/Table'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


context("Within the table of contents itself, footnotes produce no HTML (they're ignored). This applies for footnotes within entries for:", () => {
  specify('Headings', () => {
    const topLevelFootnote =
      new Footnote([new PlainText('Sometimes')], 1)

    const nestedFootnote =
      new Footnote([new PlainText('Always')], 2)

    const heading =
      new Heading([
        new PlainText('I enjoy apples'),
        topLevelFootnote,
        new PlainText(' '),
        new Emphasis([
          new PlainText('and you should too'),
          nestedFootnote
        ])
      ], 1)

    const document =
      new UpDocument([
        heading,
        new FootnoteBlock([topLevelFootnote, nestedFootnote])
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples <em>and you should too</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1">'
      + 'I enjoy apples'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-1">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-2">'
      + '<a href="#up-footnote-2">2</a>'
      + '</sup>'
      + '</em>'
      + '</h1>'
      + '<dl class="up-footnotes">'
      + '<dt id="up-footnote-1"><a href="#up-footnote-reference-1">1</a></dt><dd>Sometimes</dd>'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Always</dd>'
      + '</dl>')
  })

  specify('Tables', () => {
    const topLevelFootnote =
      new Footnote([new PlainText('Sometimes')], 1)

    const nestedFootnote =
      new Footnote([new PlainText('Always')], 2)

    const table =
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')]),
          new Table.Header.Cell([new PlainText('Developer')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Final Fantasy')]),
            new Table.Row.Cell([new PlainText('Square')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Super Mario Kart')]),
            new Table.Row.Cell([new PlainText('Nintendo')])
          ])
        ],
        new Table.Caption([
          new PlainText('I enjoy apples'),
          topLevelFootnote,
          new PlainText(' '),
          new Emphasis([
            new PlainText('and you should too'),
            nestedFootnote
          ])
        ]))

    const document =
      new UpDocument([
        table,
        new FootnoteBlock([topLevelFootnote, nestedFootnote])
      ], new UpDocument.TableOfContents([table]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">I enjoy apples <em>and you should too</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption>'
      + 'I enjoy apples'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-1">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-2">'
      + '<a href="#up-footnote-2">2</a>'
      + '</sup>'
      + '</em>'
      + '</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>'
      + '<dl class="up-footnotes">'
      + '<dt id="up-footnote-1"><a href="#up-footnote-reference-1">1</a></dt><dd>Sometimes</dd>'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Always</dd>'
      + '</dl>')
  })

  specify('Charts', () => {
    const topLevelFootnote =
      new Footnote([new PlainText('Sometimes')], 1)

    const nestedFootnote =
      new Footnote([new PlainText('Always')], 2)

    const chart =
      new Table(
        new Table.Header([
          new Table.Header.Cell([]),
          new Table.Header.Cell([new PlainText('1')]),
          new Table.Header.Cell([new PlainText('0')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('true')]),
            new Table.Row.Cell([new PlainText('false')]),
          ], new Table.Header.Cell([new PlainText('1')])),
          new Table.Row([
            new Table.Row.Cell([new PlainText('false')]),
            new Table.Row.Cell([new PlainText('false')])
          ], new Table.Header.Cell([new PlainText('0')]))
        ],
        new Table.Caption([
          new PlainText('I enjoy apples'),
          topLevelFootnote,
          new PlainText(' '),
          new Emphasis([
            new PlainText('and you should too'),
            nestedFootnote
          ])
        ]))

    const document =
      new UpDocument([
        chart,
        new FootnoteBlock([topLevelFootnote, nestedFootnote])
      ], new UpDocument.TableOfContents([chart]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">I enjoy apples <em>and you should too</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption>'
      + 'I enjoy apples'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-1">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-2">'
      + '<a href="#up-footnote-2">2</a>'
      + '</sup>'
      + '</em>'
      + '</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>'
      + '<dl class="up-footnotes">'
      + '<dt id="up-footnote-1"><a href="#up-footnote-reference-1">1</a></dt><dd>Sometimes</dd>'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Always</dd>'
      + '</dl>')
  })
})
