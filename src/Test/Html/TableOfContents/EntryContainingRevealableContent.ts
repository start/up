import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
//import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


context("Within the table of contents, the IDs of revealable content elements do not clash with those in the document. This is true within entries for:", () => {
  specify('Headings', () => {
    const heading =
      new HeadingNode([
        new PlainTextNode('I enjoy apples '),
        new InlineSpoilerNode([new PlainTextNode('sometimes')])
      ], 1)

    const documentNode =
      new DocumentNode([
        new ParagraphNode([
          new InlineSpoilerNode([new PlainTextNode('Never')]),
          new PlainTextNode(' eat apples.'),
        ]),
        heading,
      ], new DocumentNode.TableOfContents([heading]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><h2><a href="#up-part-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span>sometimes</span>'
      + '</span>'
      + '</a></h2></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-2">toggle spoiler</label>'
      + '<input id="up-spoiler-2" type="checkbox">'
      + '<span>Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<h1 id="up-part-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-3">toggle spoiler</label>'
      + '<input id="up-spoiler-3" type="checkbox">'
      + '<span>sometimes</span>'
      + '</span>'
      + '</h1>')
  })

  specify('Tables', () => {
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
          new PlainTextNode('I enjoy apples '),
          new InlineNsfwNode([new PlainTextNode('sometimes')])
        ]))

    const documentNode =
      new DocumentNode([
        new ParagraphNode([
          new InlineNsfwNode([new PlainTextNode('Never')]),
          new PlainTextNode(' eat apples.'),
        ]),
        table
      ], new DocumentNode.TableOfContents([table]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><a href="#up-part-1">'
      + 'I enjoy apples '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span>sometimes</span>'
      + '</span>'
      + '</a></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-2">toggle NSFW</label>'
      + '<input id="up-nsfw-2" type="checkbox">'
      + '<span>Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<table id="up-part-1">'
      + '<caption>'
      + 'I enjoy apples '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-3">toggle NSFW</label>'
      + '<input id="up-nsfw-3" type="checkbox">'
      + '<span>sometimes</span>'
      + '</span>'      
      + '</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

/*
  specify('Charts', () => {
    const captionRevealable =
      new InlineNsflNode([new PlainTextNode('Sometimes')])

    const paragraphRevealable =
      new InlineNsflNode([new PlainTextNode('Always')])

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
          captionRevealable,
          new PlainTextNode(' '),
          new EmphasisNode([
            new PlainTextNode('and you should too'),
            paragraphRevealable
          ])
        ]))

    const documentNode =
      new DocumentNode([chart,], new DocumentNode.TableOfContents([chart]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-part-1">I enjoy apples <em>and you should too</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-part-1">'
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
      + '</table>')
  })*/
})
