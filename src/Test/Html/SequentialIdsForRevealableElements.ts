import { expect } from 'chai'
import * as Up from '../../Main'


describe('Both inline revealables and revealable blocks', () => {
  it('have sequential IDs', () => {
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
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert">'
      + '<p>The main character defeats the bad guy.</p>'
      + '<div class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-2" name="up-revealable-2" type="radio">'
      + '<label for="up-hide-button-2" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-2" name="up-revealable-2" type="radio">'
      + '<label for="up-reveal-button-2" role="button" tabindex="0">reveal</label>'
      + '<div role="alert">'
      + '<p>'
      + 'The hero was unambiguously '
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-3" name="up-revealable-3" type="radio">'
      + '<label for="up-hide-button-3" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-3" name="up-revealable-3" type="radio">'
      + '<label for="up-reveal-button-3" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">'
      + 'good '
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-4" name="up-revealable-4" type="radio">'
      + '<label for="up-hide-button-4" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-4" name="up-revealable-4" type="radio">'
      + '<label for="up-reveal-button-4" role="button" tabindex="0">reveal</label>'
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
      + '<div class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-5" name="up-revealable-5" type="radio">'
      + '<label for="up-hide-button-5" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-5" name="up-revealable-5" type="radio">'
      + '<label for="up-reveal-button-5" role="button" tabindex="0">reveal</label>'
      + '<div role="alert">'
      + '<p>Everyone lived happily ever after, except for the bad men.</p>'
      + '</div>'
      + '</div>'

    expect(Up.render(node)).to.equal(html)
  })
})


describe("The ID of an inline revealable's checkbox (on both the checkbox and the label)", () => {
  it('is reset each time a new document is written', () => {
    const up = new Up.Up()

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
          new Up.Text('.')
        ])
      ])

    expect(up.render(node)).to.equal(up.render(node))
  })
})



describe("The ID of a revealable block's checkbox (on both the checkbox and the label)", () => {
  it('is reset each time a new document is written', () => {
    const up = new Up.Up()

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
