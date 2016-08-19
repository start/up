import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Table } from '../../../SyntaxNodes/Table'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'


context("Within the table of contents, the IDs of revealable content elements do not clash with those in the document. This is true within entries for:", () => {
  specify('Headings', () => {
    const heading =
      new Heading([
        new PlainText('I enjoy apples '),
        new InlineSpoiler([new PlainText('sometimes')])
      ], 1)

    const document =
      new UpDocument([
        new Paragraph([
          new InlineSpoiler([new PlainText('Never')]),
          new PlainText(' eat apples.'),
        ]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><h2><a href="#up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a></h2></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-2">toggle spoiler</label>'
      + '<input id="up-spoiler-2" role="button" type="checkbox">'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<h1 id="up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-3">toggle spoiler</label>'
      + '<input id="up-spoiler-3" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</h1>')
  })

  specify('Tables', () => {
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
          new PlainText('I enjoy apples '),
          new InlineNsfw([new PlainText('sometimes')])
        ]))

    const document =
      new UpDocument([
        new Paragraph([
          new InlineNsfw([new PlainText('Never')]),
          new PlainText(' eat apples.'),
        ]),
        table
      ], new UpDocument.TableOfContents([table]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><a href="#up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-2">toggle NSFW</label>'
      + '<input id="up-nsfw-2" role="button" type="checkbox">'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<table id="up-item-1">'
      + '<caption>'
      + 'I enjoy apples '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-3">toggle NSFW</label>'
      + '<input id="up-nsfw-3" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

  specify('Charts', () => {
    const table =
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
          new PlainText('I enjoy apples '),
          new InlineNsfl([new PlainText('sometimes')])
        ]))

    const document =
      new UpDocument([
        new Paragraph([
          new InlineNsfl([new PlainText('Never')]),
          new PlainText(' eat apples.'),
        ]),
        table
      ], new UpDocument.TableOfContents([table]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><a href="#up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-2">toggle NSFL</label>'
      + '<input id="up-nsfl-2" role="button" type="checkbox">'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<table id="up-item-1">'
      + '<caption>'
      + 'I enjoy apples '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-3">toggle NSFL</label>'
      + '<input id="up-nsfl-3" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })
})
