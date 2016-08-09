import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


context("Within the table of contents itself, footnotes produce no HTML (they're ignored). This applies for footnotes within entries for:", () => {
  specify('Headings', () => {
    const topLevelFootnote =
      new FootnoteNode([new PlainTextNode('Sometimes')], 1)

    const nestedFootnote =
      new FootnoteNode([new PlainTextNode('Always')], 2)

    const heading =
      new HeadingNode([
        new PlainTextNode('I enjoy apples'),
        topLevelFootnote,
        new PlainTextNode(' '),
        new EmphasisNode([
          new PlainTextNode('and you should too'),
          nestedFootnote
        ])
      ], 1)

    const documentNode =
      new DocumentNode([
        heading,
        new FootnoteBlockNode([topLevelFootnote, nestedFootnote])
      ], new DocumentNode.TableOfContents([heading]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples <em>and you should too</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1">'
      + 'I enjoy apples'
      + '<sup id="up-footnote-reference-1" class="up-footnote-reference">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup id="up-footnote-reference-2" class="up-footnote-reference">'
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
      new FootnoteNode([new PlainTextNode('Sometimes')], 1)

    const nestedFootnote =
      new FootnoteNode([new PlainTextNode('Always')], 2)

    const table =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Game')]),
          new TableNode.Header.Cell([new PlainTextNode('Developer')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
            new TableNode.Row.Cell([new PlainTextNode('Square')])
          ]),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Super Mario Kart')]),
            new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
          ])
        ],
        new TableNode.Caption([
          new PlainTextNode('I enjoy apples'),
          topLevelFootnote,
          new PlainTextNode(' '),
          new EmphasisNode([
            new PlainTextNode('and you should too'),
            nestedFootnote
          ])
        ]))

    const documentNode =
      new DocumentNode([
        table,
        new FootnoteBlockNode([topLevelFootnote, nestedFootnote])
      ], new DocumentNode.TableOfContents([table]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">I enjoy apples <em>and you should too</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption>'
      + 'I enjoy apples'
      + '<sup id="up-footnote-reference-1" class="up-footnote-reference">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup id="up-footnote-reference-2" class="up-footnote-reference">'
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
      new FootnoteNode([new PlainTextNode('Sometimes')], 1)

    const nestedFootnote =
      new FootnoteNode([new PlainTextNode('Always')], 2)

    const chart =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([]),
          new TableNode.Header.Cell([new PlainTextNode('1')]),
          new TableNode.Header.Cell([new PlainTextNode('0')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('true')]),
            new TableNode.Row.Cell([new PlainTextNode('false')]),
          ], new TableNode.Header.Cell([new PlainTextNode('1')])),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('false')]),
            new TableNode.Row.Cell([new PlainTextNode('false')])
          ], new TableNode.Header.Cell([new PlainTextNode('0')]))
        ],
        new TableNode.Caption([
          new PlainTextNode('I enjoy apples'),
          topLevelFootnote,
          new PlainTextNode(' '),
          new EmphasisNode([
            new PlainTextNode('and you should too'),
            nestedFootnote
          ])
        ]))

    const documentNode =
      new DocumentNode([
        chart,
        new FootnoteBlockNode([topLevelFootnote, nestedFootnote])
      ], new DocumentNode.TableOfContents([chart]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">I enjoy apples <em>and you should too</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption>'
      + 'I enjoy apples'
      + '<sup id="up-footnote-reference-1" class="up-footnote-reference">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup id="up-footnote-reference-2" class="up-footnote-reference">'
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
