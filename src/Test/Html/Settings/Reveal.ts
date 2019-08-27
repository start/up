import { expect } from 'chai'
import * as Up from '../../../Main'


context('The "reveal" term is used on the reveal button of revealable content:', () => {
  specify('Inline revealables', () => {
    const up = new Up.Up({
      rendering: {
        terms: { reveal: 'expand' }
      }
    })

    const node = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([
          new Up.Text('Boo!')
        ])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">expand</label>'
      + '<span role="alert">Boo!</span>'
      + '</span>'
      + '</p>'

    expect(up.render(node)).to.equal(html)
  })

  specify('Revealable blocks', () => {
    const up = new Up.Up({
      rendering: {
        terms: { reveal: 'show' }
      }
    })

    const node = new Up.Document([
      new Up.RevealableBlock([
        new Up.Paragraph([
          new Up.Text('Boo!')
        ])
      ])
    ])

    const html =
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">show</label>'
      + '<div role="alert">'
      + '<p>Boo!</p>'
      + '</div>'
      + '</div>'

    expect(up.render(node)).to.equal(html)
  })
})
