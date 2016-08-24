import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { SpoilerBlock } from '../../../SyntaxNodes/SpoilerBlock'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'


describe("Inline spoilers and spoiler blocks", () => {
  it("have sequential IDs", () => {
    const node =
      new UpDocument([
        new SpoilerBlock([
          new Paragraph([
            new PlainText('The main character defeats the bad guy.')
          ]),
          new SpoilerBlock([
            new Paragraph([
              new PlainText('The hero was unambiguously '),
              new InlineSpoiler([
                new PlainText('good '),
                new InlineSpoiler([
                  new PlainText('and righteous.')
                ])
              ])
            ])
          ])
        ]),
        new SpoilerBlock([
          new Paragraph([
            new PlainText('Everyone lived happily ever after, except for the bad men.')
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

    expect(Up.toHtml(node)).to.equal(html)
  })
})


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, '),
          new InlineSpoiler([
            new PlainText('Red')
          ]),
          new PlainText('. We meet for the '),
          new InlineSpoiler([
            new Emphasis([
              new PlainText('eighth')
            ])
          ]),
          new PlainText(' time.')
        ]),
        new Paragraph([
          new PlainText('Hello, '),
          new InlineSpoiler([
            new PlainText('Blue')
          ]),
          new PlainText('.'),
        ])
      ])

    expect(up.toHtml(node)).to.equal(up.toHtml(node))
  })
})



describe("The ID of a spoiler block's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up()

    const node =
      new UpDocument([
        new SpoilerBlock([
          new Paragraph([
            new PlainText('After you beat the Elite Four, you have to face your rival.')
          ])
        ]),
        new Paragraph([
          new PlainText("But the game isn't over yet!")
        ]),
        new SpoilerBlock([
          new Paragraph([
            new PlainText('Once you beat your rival, you can finally enter Cerulean Cave.')
          ])
        ])
      ])

    expect(up.toHtml(node)).to.equal(up.toHtml(node))
  })
})
