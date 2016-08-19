import { expect } from 'chai'
import Up from '../../index'
import { InlineUpDocument } from '../../SyntaxNodes/InlineUpDocument'

import { Link } from '../../SyntaxNodes/Link'
import { Image } from '../../SyntaxNodes/Image'
import { Audio } from '../../SyntaxNodes/Audio'
import { Video } from '../../SyntaxNodes/Video'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { ExampleInput } from '../../SyntaxNodes/ExampleInput'
import { Stress } from '../../SyntaxNodes/Stress'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { RevisionInsertion } from '../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../../SyntaxNodes/RevisionDeletion'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'


describe('An empty inline document', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.toInlineHtml(new InlineUpDocument([]))).to.be.eql('')
  })
})


context('In an inline document, every inline syntax node produces the same HTML as it would in a regular document. However, the HTML is not wrapped in a container element (e.g. <p>)', () => {
  describe('An emphasis node', () => {
    it('produces an <em> element', () => {
      const inlineDocument = new InlineUpDocument([
        new Emphasis([new PlainText('Always')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<em>Always</em>')
    })
  })


  describe('A stress node', () => {
    it('produces a <strong> element', () => {
      const inlineDocument = new InlineUpDocument([
        new Stress([new PlainText('Ness')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<strong>Ness</strong>')
    })
  })


  describe('An italic node', () => {
    it('produces an <i> element', () => {
      const inlineDocument = new InlineUpDocument([
        new Italic([new PlainText('Ness')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<i>Ness</i>')
    })
  })


  describe('A bold node', () => {
    it('produces a <b> element', () => {
      const inlineDocument = new InlineUpDocument([
        new Bold([new PlainText('Ness')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<b>Ness</b>')
    })
  })


  describe('An inline code node', () => {
    it('produces a <code> element', () => {
      const inlineDocument = new InlineUpDocument([
        new InlineCode('then')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<code>then</code>')
    })
  })


  describe('An example input node', () => {
    it('produces a <kbd> element', () => {
      const inlineDocument = new InlineUpDocument([
        new ExampleInput('esc')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<kbd>esc</kbd>')
    })
  })


  describe('A revision insertion node', () => {
    it('produces an <ins> element', () => {
      const inlineDocument = new InlineUpDocument([
        new RevisionInsertion([new PlainText('Wario')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<ins>Wario</ins>')
    })
  })


  describe('A revision deletion node', () => {
    it('produces a <del> element', () => {
      const inlineDocument = new InlineUpDocument([
        new RevisionDeletion([new PlainText('Koopa Troopa')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<del>Koopa Troopa</del>')
    })
  })


  describe('A normal parenthetical node', () => {
    it('produces a <small> element', () => {
      const inlineDocument = new InlineUpDocument([
        new NormalParenthetical([new PlainText('(Koopa Troopa)')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<small>(Koopa Troopa)</small>')
    })
  })


  describe('A square parenthetical node', () => {
    it('produces a <small class="up-square-brackets"> element', () => {
      const inlineDocument = new InlineUpDocument([
        new SquareParenthetical([new PlainText('[Koopa Troopa]')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<small class="up-square-brackets">[Koopa Troopa]</small>')
    })
  })


  describe('A link node', () => {
    it('produces an <a> element with its href attribute set to its URL', () => {
      const inlineDocument = new InlineUpDocument([
        new Link([new PlainText('Google')], 'https://google.com')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<a href="https://google.com">Google</a>')
    })
  })


  describe('An image node', () => {
    it('produces <img> with its "src" attribute set to its URL and its "alt" and "title" attributes set to its description', () => {
      const inlineDocument = new InlineUpDocument([
        new Image('haunted house', 'http://example.com/hauntedhouse.svg')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(
        '<img alt="haunted house" src="http://example.com/hauntedhouse.svg" title="haunted house">')
    })
  })


  describe('An audio node', () => {
    it('produces an <audio controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the audio file', () => {
      const inlineDocument = new InlineUpDocument([
        new Audio('ghostly howling', 'http://example.com/ghosts.ogg')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(
        '<audio controls loop src="http://example.com/ghosts.ogg" title="ghostly howling">'
        + '<a href="http://example.com/ghosts.ogg">ghostly howling</a>'
        + '</audio>')
    })
  })


  describe('A video node', () => {
    it('produces a <video controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the video file', () => {
      const inlineDocument = new InlineUpDocument([
        new Video('ghosts eating luggage', 'http://example.com/poltergeists.webm')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(
        '<video controls loop src="http://example.com/poltergeists.webm" title="ghosts eating luggage">'
        + '<a href="http://example.com/poltergeists.webm">ghosts eating luggage</a>'
        + '</video>')
    })
  })


  describe('A highlight node', () => {
    it('produces a <mark> element', () => {
      const inlineDocument = new InlineUpDocument([
        new Highlight([new PlainText('45.9%')])
      ])

      const html =
        '<mark>45.9%</mark>'

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(html)
    })
  })


  describe('An inline spoiler node', () => {
    it('produces a <span class="up-spoiler up-revealable"> element, containing a <label> element (with the text "toggle spoiler"), an associated checkbox, and a <span role="alert"> element containing the spoiler contents', () => {
      const inlineDocument = new InlineUpDocument([
        new InlineSpoiler([new PlainText('45.9%')])
      ])

      const html =
        '<span class="up-spoiler up-revealable">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<span role="alert">45.9%</span>'
        + '</span>'

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(html)
    })
  })


  describe('An inline NSFW node', () => {
    it('produces a <span class="up-nsfw up-revealable">, containing a <label> element (with the text "toggle NSFW"), an associated checkbox, and a <span role="alert"> element containing the NSFW contents', () => {
      const inlineDocument = new InlineUpDocument([
        new InlineNsfw([new PlainText('naked Gary')])
      ])

      const html =
        '<span class="up-nsfw up-revealable">'
        + '<label for="up-nsfw-1">toggle NSFW</label>'
        + '<input id="up-nsfw-1" role="button" type="checkbox">'
        + '<span role="alert">naked Gary</span>'
        + '</span>'

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(html)
    })
  })


  describe('An inline NSFL node', () => {
    it('produces a <span class="up-nsfl up-revealable">, containing a <label> element (with the text "toggle NSFL"), an associated checkbox, and a <span role="alert"> element containing the NSFL contents', () => {
      const inlineDocument = new InlineUpDocument([
        new InlineNsfl([new PlainText('rotting Gary')])
      ])

      const html =
        '<span class="up-nsfl up-revealable">'
        + '<label for="up-nsfl-1">toggle NSFL</label>'
        + '<input id="up-nsfl-1" role="button" type="checkbox">'
        + '<span role="alert">rotting Gary</span>'
        + '</span>'

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(html)
    })
  })
})
