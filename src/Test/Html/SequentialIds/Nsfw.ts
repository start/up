import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'


describe("Inline NSFW conventions and NSFW blocks", () => {
  it("have sequential IDs", () => {
    const node =
      new UpDocument([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('The main character defeats the bad guy.')
          ]),
          new NsfwBlockNode([
            new ParagraphNode([
              new PlainTextNode('The hero was unambiguously '),
              new InlineNsfwNode([
                new PlainTextNode('good '),
                new InlineNsfwNode([
                  new PlainTextNode('and righteous.')
                ])
              ])
            ])
          ])
        ]),
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('Everyone lived happily ever after, except for the bad men.')
          ])
        ])
      ])

    const html =
      '<div class="up-nsfw up-revealable"><label for="up-nsfw-1">toggle NSFW</label><input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>The main character defeats the bad guy.</p>'
      + '<div class="up-nsfw up-revealable"><label for="up-nsfw-2">toggle NSFW</label><input id="up-nsfw-2" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>'
      + 'The hero was unambiguously '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-3">toggle NSFW</label>'
      + '<input id="up-nsfw-3" role="button" type="checkbox">'
      + '<span role="alert">'
      + 'good '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-4">toggle NSFW</label>'
      + '<input id="up-nsfw-4" role="button" type="checkbox">'
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
      + '<div class="up-nsfw up-revealable"><label for="up-nsfw-5">toggle NSFW</label><input id="up-nsfw-5" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>Everyone lived happily ever after, except for the bad men.</p>'
      + '</div>'
      + '</div>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of an inline NSFW convention's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsfwNode([
            new PlainTextNode('Red')
          ]),
          new PlainTextNode('. We meet for the '),
          new InlineNsfwNode([
            new Emphasis([
              new PlainTextNode('eighth')
            ])
          ]),
          new PlainTextNode(' time.')
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, '),
          new InlineNsfwNode([
            new PlainTextNode('Blue')
          ]),
          new PlainTextNode('.'),
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})



describe("The ID of a NSFW block's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('After you beat the Elite Four, you have to face your rival.')
          ])
        ]),
        new ParagraphNode([
          new PlainTextNode("But the game isn't over yet!")
        ]),
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode('Once you beat your rival, you can finally enter Cerulean Cave.')
          ])
        ])
      ])

    expect(up.toHtml(node)).to.be.eql(up.toHtml(node))
  })
})
