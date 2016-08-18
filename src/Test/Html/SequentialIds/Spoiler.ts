import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'


describe("Inline spoilers and spoiler blocks", () => {
  it("have sequential IDs", () => {
    const node =
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('The main character defeats the bad guy.')
          ]),
          new SpoilerBlockNode([
            new ParagraphNode([
              new PlainTextNode('The hero was unambiguously '),
              new InlineSpoilerNode([
                new PlainTextNode('good '),
                new InlineSpoilerNode([
                  new PlainTextNode('and righteous.')
                ])
              ])
            ])
          ])
        ]),
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('Everyone lived happily ever after, except for the bad men.')
          ])
        ])
      ])

    const html =
      '<div class="up-spoiler up-revealable"><label for="up-spoiler-1">toggle spoiler</label><input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>The main character defeats the bad guy.</p>'
      + '<div class="up-spoiler up-revealable"><label for="up-spoiler-2">toggle spoiler</label><input id="up-spoiler-2" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>'
      + 'The hero was unambiguously '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-3">toggle spoiler</label>'
      + '<input id="up-spoiler-3" role="button" type="checkbox">'
      + '<span role="alert">'
      + 'good '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-4">toggle spoiler</label>'
      + '<input id="up-spoiler-4" role="button" type="checkbox">'
      + '<span role="alert">'
      + 'and righteous.'
      + '</span>'
      + '</span>'
      + '</span>'
      + '</span>'
      + '</p>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="up-spoiler up-revealable"><label for="up-spoiler-5">toggle spoiler</label><input id="up-spoiler-5" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>Everyone lived happily ever after, except for the bad men.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
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



describe("The ID of a spoiler block's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('After you beat the Elite Four, you have to face your rival.')
          ])
        ]),
        new ParagraphNode([
          new PlainTextNode("But the game isn't over yet!")
        ]),
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode('Once you beat your rival, you can finally enter Cerulean Cave.')
          ])
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})
