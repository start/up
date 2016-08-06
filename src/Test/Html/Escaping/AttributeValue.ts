import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


context('Within any attribute value, all instances of " and & are escaped. Specifically, within the:', () => {
  specify("src attribute of links", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([], 'https://example.com/?x&y&z="hi"')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<p><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></p>')
  })

  specify("src attribute of audio elements (and of their fallback links)", () => {
    const documentNode = new DocumentNode([
      new AudioNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<audio src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title="" controls loop><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></audio>')
  })

  specify("src attribute of videos (and of their fallback links)", () => {
    const documentNode = new DocumentNode([
      new VideoNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<video src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title="" controls loop><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></video>')
  })

  specify("src attribute of images", () => {
    const documentNode = new DocumentNode([
      new ImageNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<img src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" alt="" title="">')
  })

  specify("title attribute of audio elements", () => {
    const documentNode = new DocumentNode([
      new AudioNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<audio src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;" controls loop><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></audio>')
  })

  specify("title attribute of videos", () => {
    const documentNode = new DocumentNode([
      new VideoNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<video src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;" controls loop><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></video>')
  })

  specify("alt and title attributes of images", () => {
    const documentNode = new DocumentNode([
      new ImageNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<img src="" alt="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;">')
  })

  specify('href attribute of backlinks in footnote blocks', () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { footnoteReference: 'look "up" & read & remember' }
      }
    })

    const documentNode = new DocumentNode([
      new FootnoteBlockNode([
        new FootnoteNode([], 2)
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up&quot;&amp;&amp;&quot;footnote&quot;&amp;&amp;&quot;2">'
      + '<a href="#up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;up&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;read&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;remember&quot;&amp;&amp;&quot;2">2</a>'
      + '</dt><dd></dd>'
      + '</dl>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify('id attribute of footntoes in a footnote block', () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { footnote: 'look "down" & read & learn' }
      }
    })

    const documentNode = new DocumentNode([
      new FootnoteBlockNode([
        new FootnoteNode([], 2)
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;down&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;read&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;learn&quot;&amp;&amp;&quot;2">'
      + '<a href="#up&quot;&amp;&amp;&quot;footnote&quot;&amp;&amp;&quot;reference&quot;&amp;&amp;&quot;2">2</a>'
      + '</dt><dd></dd>'
      + '</dl>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify("href attribute of a footnote reference's link", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { footnote: 'look "down" & read & learn' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    const html =
      '<p>'
      + '<sup id="up&quot;&amp;&amp;&quot;footnote&quot;&amp;&amp;&quot;reference&quot;&amp;&amp;&quot;3" class="up-footnote-reference">'
      + '<a href="#up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;down&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;read&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;learn&quot;&amp;&amp;&quot;3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify('id attribute of footnote references', () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { footnoteReference: 'look "up" & read & remember' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    const html =
      '<p>'
      + '<sup id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;up&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;read&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;remember&quot;&amp;&amp;&quot;3" class="up-footnote-reference">'
      + '<a href="#up&quot;&amp;&amp;&quot;footnote&quot;&amp;&amp;&quot;3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify("id attribute of inline spoilers' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { spoiler: 'look "away" & smile & forget' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([new PlainTextNode('45.9%')])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle spoiler</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<span>45.9%</span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify("id attribute of inline NSFW conventions' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { nsfw: 'look "away" & smile & forget' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([new PlainTextNode('45.9%')])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle NSFW</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<span>45.9%</span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify("id attribute of inline NSFL conventions' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { nsfl: 'look "away" & smile & forget' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([new PlainTextNode('45.9%')])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle NSFL</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<span>45.9%</span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify("id attribute of spoiler blocks' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { spoiler: 'look "away" & smile & forget' }
      }
    })

    const documentNode = new DocumentNode([
      new SpoilerBlockNode([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle spoiler</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify("id attribute of NSFW blocks' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { nsfw: 'look "away" & smile & forget' }
      }
    })

    const documentNode = new DocumentNode([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle NSFW</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  specify("id attribute of NSFL blocks' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '"&&"',
        terms: { nsfl: 'look "away" & smile & forget' }
      }
    })

    const documentNode = new DocumentNode([
      new NsflBlockNode([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle NSFL</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("Within a link's href attribute, <, ', and >", () => {
  it("are not escaped", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([], "https://example.com/?z='<span>'")
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<p><a href="https://example.com/?z=\'<span>\'"></a></p>')
  })
})
