import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { NsflBlock } from '../../../SyntaxNodes/NsflBlock'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'


describe("Inline NSFL conventions and NSFL blocks", () => {
  it("have sequential IDs", () => {
    const node =
      new UpDocument([
        new NsflBlock([
          new Paragraph([
            new PlainText('The main character defeats the bad guy.')
          ]),
          new NsflBlock([
            new Paragraph([
              new PlainText('The hero was unambiguously '),
              new InlineNsfl([
                new PlainText('good '),
                new InlineNsfl([
                  new PlainText('and righteous.')
                ])
              ])
            ])
          ])
        ]),
        new NsflBlock([
          new Paragraph([
            new PlainText('Everyone lived happily ever after, except for the bad men.')
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

    expect(Up.toHtml(node)).to.equal(html)
  })
})


describe("The ID of an inline NSFL convention's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, '),
          new InlineNsfl([
            new PlainText('Red')
          ]),
          new PlainText('. We meet for the '),
          new InlineNsfl([
            new Emphasis([
              new PlainText('eighth')
            ])
          ]),
          new PlainText(' time.')
        ]),
        new Paragraph([
          new PlainText('Hello, '),
          new InlineNsfl([
            new PlainText('Blue')
          ]),
          new PlainText('.'),
        ])
      ])

    expect(up.toHtml(node)).to.equal(up.toHtml(node))
  })
})



describe("The ID of a NSFL block's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new NsflBlock([
          new Paragraph([
            new PlainText('After you beat the Elite Four, you have to face your rival.')
          ])
        ]),
        new Paragraph([
          new PlainText("But the game isn't over yet!")
        ]),
        new NsflBlock([
          new Paragraph([
            new PlainText('Once you beat your rival, you can finally enter Cerulean Cave.')
          ])
        ])
      ])

    expect(up.toHtml(node)).to.equal(up.toHtml(node))
  })
})
