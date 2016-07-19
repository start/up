import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'


describe("Multiple spoilers in a document", () => {
  it("have have sequential IDs", () => {
    const node =
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineSpoilerNode([
            new PlainTextNode('Red')
          ]),
          new PlainTextNode('. We meet for the '),
          new InlineSpoilerNode([
            new EmphasisNode([
              new PlainTextNode('eighth')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineSpoilerNode([
            new PlainTextNode('Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    const html =
      '<p>'
      + 'Hello, '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span>Red</span>'
      + '</span>'
      + '. We meet for the '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-2">toggle spoiler</label>'
      + '<input id="up-spoiler-2" type="checkbox">'
      + '<span><em>eighth</em></span>'
      + '</span>'
      + ' time.'
      + '</p>'
      + '<p>'
      + 'Hello, '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-3">toggle spoiler</label>'
      + '<input id="up-spoiler-3" type="checkbox">'
      + '<span>Blue</span>'
      + '</span>'
      + '.'
      + '</p>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("reset each time a new document is written", () => {
    const up = new Up()
    
    const node =
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineSpoilerNode([
            new PlainTextNode('Red')
          ]),
          new PlainTextNode('. We meet for the '),
          new InlineSpoilerNode([
            new EmphasisNode([
              new PlainTextNode('eighth')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineSpoilerNode([
            new PlainTextNode('Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})
