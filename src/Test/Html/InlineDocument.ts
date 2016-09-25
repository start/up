import { expect } from 'chai'
import * as Up from '../../index'



describe('An empty inline document', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.renderInline(new Up.InlineDocument([]))).to.equal('')
  })
})


context('In an inline document, every inline syntax node produces the same HTML as it would in a regular document. However, the HTML is not wrapped in a container element (e.g. <p>)', () => {
  describe('An emphasis node', () => {
    it('produces an <em> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Emphasis([new Up.Text('Always')])
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<em>Always</em>')
    })
  })


  describe('A stress node', () => {
    it('produces a <strong> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Stress([new Up.Text('Ness')])
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<strong>Ness</strong>')
    })
  })


  describe('An italics node', () => {
    it('produces an <i> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Italics([new Up.Text('Ness')])
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<i>Ness</i>')
    })
  })


  describe('A bold node', () => {
    it('produces a <b> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Bold([new Up.Text('Ness')])
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<b>Ness</b>')
    })
  })


  describe('An inline code node', () => {
    it('produces a <code> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.InlineCode('then')
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<code>then</code>')
    })
  })


  describe('An example input node', () => {
    it('produces a <kbd> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.ExampleInput('esc')
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<kbd>esc</kbd>')
    })
  })


  describe('A normal parenthetical node', () => {
    it('produces a <small class="up-parenthetical"> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.NormalParenthetical([new Up.Text('(Koopa Troopa)')])
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<small class="up-parenthetical">(Koopa Troopa)</small>')
    })
  })


  describe('A square parenthetical node', () => {
    it('produces a <small class="up-parenthetical up-square-brackets"> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.SquareParenthetical([new Up.Text('[Koopa Troopa]')])
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<small class="up-parenthetical up-square-brackets">[Koopa Troopa]</small>')
    })
  })


  describe('A link node', () => {
    it('produces an <a> element with its href attribute set to its URL', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Link([new Up.Text('Google')], 'https://google.com')
      ])

      expect(Up.renderInline(inlineDocument)).to.equal('<a href="https://google.com">Google</a>')
    })
  })


  describe('An image node', () => {
    it('produces <img> with its "src" attribute set to its URL and its "alt" and "title" attributes set to its description', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Image('haunted house', 'http://example.com/hauntedhouse.svg')
      ])

      expect(Up.renderInline(inlineDocument)).to.equal(
        '<img alt="haunted house" src="http://example.com/hauntedhouse.svg" title="haunted house">')
    })
  })


  describe('An audio node', () => {
    it('produces an <audio controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the audio file', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Audio('ghostly howling', 'http://example.com/ghosts.ogg')
      ])

      expect(Up.renderInline(inlineDocument)).to.equal(
        '<audio controls loop src="http://example.com/ghosts.ogg" title="ghostly howling">'
        + '<a href="http://example.com/ghosts.ogg">ghostly howling</a>'
        + '</audio>')
    })
  })


  describe('A video node', () => {
    it('produces a <video controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the video file', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ])

      expect(Up.renderInline(inlineDocument)).to.equal(
        '<video controls loop src="http://example.com/poltergeists.webm" title="ghosts eating luggage">'
        + '<a href="http://example.com/poltergeists.webm">ghosts eating luggage</a>'
        + '</video>')
    })
  })


  describe('A highlight node', () => {
    it('produces a <mark> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.Highlight([new Up.Text('45.9%')])
      ])

      const html =
        '<mark>45.9%</mark>'

      expect(Up.renderInline(inlineDocument)).to.equal(html)
    })
  })


  describe('An inline spoiler node', () => {
    it('produces a <span class="up-spoiler up-revealable"> element, containing a <label> element (with the text "toggle spoiler"), an associated checkbox, and a <span role="alert"> element containing the spoiler contents', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.InlineSpoiler([new Up.Text('45.9%')])
      ])

      const html =
        '<span class="up-spoiler up-revealable">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<span role="alert">45.9%</span>'
        + '</span>'

      expect(Up.renderInline(inlineDocument)).to.equal(html)
    })
  })


  describe('An inline NSFW node', () => {
    it('produces a <span class="up-nsfw up-revealable">, containing a <label> element (with the text "toggle NSFW"), an associated checkbox, and a <span role="alert"> element containing the NSFW contents', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.InlineNsfw([new Up.Text('naked Gary')])
      ])

      const html =
        '<span class="up-nsfw up-revealable">'
        + '<label for="up-nsfw-1">toggle NSFW</label>'
        + '<input id="up-nsfw-1" role="button" type="checkbox">'
        + '<span role="alert">naked Gary</span>'
        + '</span>'

      expect(Up.renderInline(inlineDocument)).to.equal(html)
    })
  })


  describe('An inline NSFL node', () => {
    it('produces a <span class="up-nsfl up-revealable">, containing a <label> element (with the text "toggle NSFL"), an associated checkbox, and a <span role="alert"> element containing the NSFL contents', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.InlineNsfl([new Up.Text('rotting Gary')])
      ])

      const html =
        '<span class="up-nsfl up-revealable">'
        + '<label for="up-nsfl-1">toggle NSFL</label>'
        + '<input id="up-nsfl-1" role="button" type="checkbox">'
        + '<span role="alert">rotting Gary</span>'
        + '</span>'

      expect(Up.renderInline(inlineDocument)).to.equal(html)
    })
  })


  describe('An inline quote node', () => {
    it('produces a <q>> element', () => {
      const inlineDocument = new Up.InlineDocument([
        new Up.InlineQuote([new Up.Text('45.9%')])
      ])

      const html =
        '<q>45.9%</q>'

      expect(Up.renderInline(inlineDocument)).to.equal(html)
    })
  })
})
