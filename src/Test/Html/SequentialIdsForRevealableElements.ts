import { expect } from 'chai'
import * as Up from '../../index'


describe("Both inline revealables and revealable blocks", () => {
  it("have sequential IDs", () => {
    const node =
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('The main character defeats the bad guy.')
          ]),
          new Up.RevealableBlock([
            new Up.Paragraph([
              new Up.Text('The hero was unambiguously '),
              new Up.InlineRevealable([
                new Up.Text('good '),
                new Up.InlineRevealable([
                  new Up.Text('and righteous.')
                ])
              ])
            ])
          ])
        ]),
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('Everyone lived happily ever after, except for the bad men.')
          ])
        ])
      ])

    const html =
      '<div class="up-revealable"><label for="up-revealable-1">reveal</label><input id="up-revealable-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>The main character defeats the bad guy.</p>'
      + '<div class="up-revealable"><label for="up-revealable-2">reveal</label><input id="up-revealable-2" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>'
      + 'The hero was unambiguously '
      + '<span class="up-revealable">'
      + '<label for="up-revealable-3">reveal</label>'
      + '<input id="up-revealable-3" role="button" type="checkbox">'
      + '<span role="alert">'
      + 'good '
      + '<span class="up-revealable">'
      + '<label for="up-revealable-4">reveal</label>'
      + '<input id="up-revealable-4" role="button" type="checkbox">'
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
      + '<div class="up-revealable"><label for="up-revealable-5">reveal</label><input id="up-revealable-5" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<p>Everyone lived happily ever after, except for the bad men.</p>'
      + '</div>'
      + '</div>'

    expect(Up.render(node)).to.equal(html)
  })
})


describe("The ID of an inline revealable's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up.Transformer()

    const node =
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Hello, '),
          new Up.InlineRevealable([
            new Up.Text('Red')
          ]),
          new Up.Text('. We meet for the '),
          new Up.InlineRevealable([
            new Up.Emphasis([
              new Up.Text('eighth')
            ])
          ]),
          new Up.Text(' time.')
        ]),
        new Up.Paragraph([
          new Up.Text('Hello, '),
          new Up.InlineRevealable([
            new Up.Text('Blue')
          ]),
          new Up.Text('.'),
        ])
      ])

    expect(up.render(node)).to.equal(up.render(node))
  })
})



describe("The ID of a revealable block's checkbox (on both the checkbox and the label)", () => {
  it("is reset each time a new document is written", () => {
    const up = new Up.Transformer()

    const node =
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('After you beat the Elite Four, you have to face your rival.')
          ])
        ]),
        new Up.Paragraph([
          new Up.Text("But the game isn't over yet!")
        ]),
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('Once you beat your rival, you can finally enter Cerulean Cave.')
          ])
        ])
      ])

    expect(up.render(node)).to.equal(up.render(node))
  })
})
