import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { NotSafeForLifeNode } from '../../../SyntaxNodes/NotSafeForLifeNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'


describe("The ID of a NSFL convention's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfl'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfl: 'life ruining' }
      }
    })

    const node = new NotSafeForLifeNode([])

    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="up-life-ruining-1">toggle nsfl</label>'
      + '<input id="up-life-ruining-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Multiple NSFL conventions in a document", () => {
  it("have have sequential IDs", () => {
    const node =
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new NotSafeForLifeNode([
            new PlainTextNode('rotting Red')
          ]),
          new PlainTextNode('. We meet for the eighth'),
          new NotSafeForLifeNode([
            new EmphasisNode([
              new PlainTextNode('fetid')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new NotSafeForLifeNode([
            new PlainTextNode('rotting Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    const html =
      '<p>'
      + 'Hello, '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle nsfl</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span>rotting Red</span>'
      + '</span>'
      + '. We meet for the eighth'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-2">toggle nsfl</label>'
      + '<input id="up-nsfl-2" type="checkbox">'
      + '<span><em>fetid</em></span>'
      + '</span>'
      + ' time.'
      + '</p>'
      + '<p>'
      + 'Hello, '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-3">toggle nsfl</label>'
      + '<input id="up-nsfl-3" type="checkbox">'
      + '<span>rotting Blue</span>'
      + '</span>'
      + '.'
      + '</p>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of a NSFL convention's checkbox (on both the checkbox and the label)", () => {
  it("reset each time a new document is written", () => {
    const up = new Up()
    
    const node =
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new NotSafeForLifeNode([
            new PlainTextNode('rotting Red')
          ]),
          new PlainTextNode('. We meet for the eighth'),
          new NotSafeForLifeNode([
            new EmphasisNode([
              new PlainTextNode('fetid')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new NotSafeForLifeNode([
            new PlainTextNode('rotting Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})