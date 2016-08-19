import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'


describe("Inline NSFL conventions and NSFL blocks", () => {
  it("have sequential IDs", () => {
    const node =
      new UpDocument([
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode('The main character defeats the bad guy.')
          ]),
          new NsflBlockNode([
            new ParagraphNode([
              new PlainTextNode('The hero was unambiguously '),
              new InlineNsflNode([
                new PlainTextNode('good '),
                new InlineNsflNode([
                  new PlainTextNode('and righteous.')
                ])
              ])
            ])
          ])
        ]),
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode('Everyone lived happily ever after, except for the bad men.')
          ])
        ])
      ])

    const html =
      '<div class="up-nsfl up-revealable"><label for="up-nsfl-1">toggle NSFL</label><input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>The main character defeats the bad guy.</p>'
      + '<div class="up-nsfl up-revealable"><label for="up-nsfl-2">toggle NSFL</label><input id="up-nsfl-2" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>'
      + 'The hero was unambiguously '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-3">toggle NSFL</label>'
      + '<input id="up-nsfl-3" role="button" type="checkbox">'
      + '<span role="alert">'
      + 'good '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-4">toggle NSFL</label>'
      + '<input id="up-nsfl-4" role="button" type="checkbox">'
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
      + '<div class="up-nsfl up-revealable"><label for="up-nsfl-5">toggle NSFL</label><input id="up-nsfl-5" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>Everyone lived happily ever after, except for the bad men.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of an inline NSFL convention's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsflNode([
            new PlainTextNode('Red')
          ]),
          new PlainTextNode('. We meet for the '),
          new InlineNsflNode([
            new Emphasis([
              new PlainTextNode('eighth')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsflNode([
            new PlainTextNode('Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})



describe("The ID of a NSFL block's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode('After you beat the Elite Four, you have to face your rival.')
          ])
        ]),
        new ParagraphNode([
          new PlainTextNode("But the game isn't over yet!")
        ]),
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode('Once you beat your rival, you can finally enter Cerulean Cave.')
          ])
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})
