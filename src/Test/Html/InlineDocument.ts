import { expect } from 'chai'
import Up from '../../index'
import { InlineUpDocument } from '../../SyntaxNodes/InlineUpDocument'

import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { ExampleInputNode } from '../../SyntaxNodes/ExampleInputNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { ItalicNode } from '../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../SyntaxNodes/BoldNode'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { NormalParentheticalNode } from '../../SyntaxNodes/NormalParentheticalNode'
import { SquareParentheticalNode } from '../../SyntaxNodes/SquareParentheticalNode'
import { HighlightNode } from '../../SyntaxNodes/HighlightNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'


describe('An empty inline document', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.toInlineHtml(new InlineUpDocument([]))).to.be.eql('')
  })
})


context('In an inline document, every inline syntax node produces the same HTML as it would in a regular document. However, the HTML is not wrapped in a container element (e.g. <p>)', () => {
  describe('An emphasis node', () => {
    it('produces an <em> element', () => {
      const inlineDocument = new InlineUpDocument([
        new Emphasis([new PlainTextNode('Always')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<em>Always</em>')
    })
  })


  describe('A stress node', () => {
    it('produces a <strong> element', () => {
      const inlineDocument = new InlineUpDocument([
        new StressNode([new PlainTextNode('Ness')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<strong>Ness</strong>')
    })
  })


  describe('An italic node', () => {
    it('produces an <i> element', () => {
      const inlineDocument = new InlineUpDocument([
        new ItalicNode([new PlainTextNode('Ness')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<i>Ness</i>')
    })
  })


  describe('A bold node', () => {
    it('produces a <b> element', () => {
      const inlineDocument = new InlineUpDocument([
        new BoldNode([new PlainTextNode('Ness')])
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
        new ExampleInputNode('esc')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<kbd>esc</kbd>')
    })
  })


  describe('A revision insertion node', () => {
    it('produces an <ins> element', () => {
      const inlineDocument = new InlineUpDocument([
        new RevisionInsertionNode([new PlainTextNode('Wario')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<ins>Wario</ins>')
    })
  })


  describe('A revision deletion node', () => {
    it('produces a <del> element', () => {
      const inlineDocument = new InlineUpDocument([
        new RevisionDeletionNode([new PlainTextNode('Koopa Troopa')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<del>Koopa Troopa</del>')
    })
  })


  describe('A normal parenthetical node', () => {
    it('produces a <small> element', () => {
      const inlineDocument = new InlineUpDocument([
        new NormalParentheticalNode([new PlainTextNode('(Koopa Troopa)')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<small>(Koopa Troopa)</small>')
    })
  })


  describe('A square parenthetical node', () => {
    it('produces a <small class="up-square-brackets"> element', () => {
      const inlineDocument = new InlineUpDocument([
        new SquareParentheticalNode([new PlainTextNode('[Koopa Troopa]')])
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<small class="up-square-brackets">[Koopa Troopa]</small>')
    })
  })


  describe('A link node', () => {
    it('produces an <a> element with its href attribute set to its URL', () => {
      const inlineDocument = new InlineUpDocument([
        new LinkNode([new PlainTextNode('Google')], 'https://google.com')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql('<a href="https://google.com">Google</a>')
    })
  })


  describe('An image node', () => {
    it('produces <img> with its "src" attribute set to its URL and its "alt" and "title" attributes set to its description', () => {
      const inlineDocument = new InlineUpDocument([
        new ImageNode('haunted house', 'http://example.com/hauntedhouse.svg')
      ])

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(
        '<img alt="haunted house" src="http://example.com/hauntedhouse.svg" title="haunted house">')
    })
  })


  describe('An audio node', () => {
    it('produces an <audio controls loop> with its "src" attribute set to its URL and its "title" attribute set to its description, containing a fallback link to the audio file', () => {
      const inlineDocument = new InlineUpDocument([
        new AudioNode('ghostly howling', 'http://example.com/ghosts.ogg')
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
        new VideoNode('ghosts eating luggage', 'http://example.com/poltergeists.webm')
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
        new HighlightNode([new PlainTextNode('45.9%')])
      ])

      const html =
        '<mark>45.9%</mark>'

      expect(Up.toInlineHtml(inlineDocument)).to.be.eql(html)
    })
  })


  describe('An inline spoiler node', () => {
    it('produces a <span class="up-spoiler up-revealable"> element, containing a <label> element (with the text "toggle spoiler"), an associated checkbox, and a <span role="alert"> element containing the spoiler contents', () => {
      const inlineDocument = new InlineUpDocument([
        new InlineSpoilerNode([new PlainTextNode('45.9%')])
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
        new InlineNsfwNode([new PlainTextNode('naked Gary')])
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
        new InlineNsflNode([new PlainTextNode('rotting Gary')])
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
