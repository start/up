import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'


describe("The ID of an inline NSFW convention's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'explicit' }
      }
    })

    const node = new InlineNsfwNode([])

    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="up-explicit-1">toggle nsfw</label>'
      + '<input id="up-explicit-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Multiple NSFW conventions in a document", () => {
  it("have have sequential IDs", () => {
    const node =
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsfwNode([
            new PlainTextNode('naked Red')
          ]),
          new PlainTextNode('. We meet for the eighth'),
          new InlineNsfwNode([
            new EmphasisNode([
              new PlainTextNode('naked')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsfwNode([
            new PlainTextNode('naked Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    const html =
      '<p>'
      + 'Hello, '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle nsfw</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span>naked Red</span>'
      + '</span>'
      + '. We meet for the eighth'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-2">toggle nsfw</label>'
      + '<input id="up-nsfw-2" type="checkbox">'
      + '<span><em>naked</em></span>'
      + '</span>'
      + ' time.'
      + '</p>'
      + '<p>'
      + 'Hello, '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-3">toggle nsfw</label>'
      + '<input id="up-nsfw-3" type="checkbox">'
      + '<span>naked Blue</span>'
      + '</span>'
      + '.'
      + '</p>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of an inline NSFL convention's checkbox (on both the checkbox and the label)", () => {
  it("reset each time a new document is written", () => {
    const up = new Up()
    
    const node =
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsfwNode([
            new PlainTextNode('naked Red')
          ]),
          new PlainTextNode('. We meet for the eighth'),
          new InlineNsfwNode([
            new EmphasisNode([
              new PlainTextNode('naked')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsfwNode([
            new PlainTextNode('naked Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})
