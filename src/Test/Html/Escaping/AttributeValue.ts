import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
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


context('Within any attribute value, all instances of " and & are escaped. Specifically, within the', () => {
  specify("src attribute of links", () => {
    const document = new DocumentNode([
      new ParagraphNode([
        new LinkNode([], 'https://example.com/?x&y&z="hi"')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></p>')
  })

  specify("src attribute of audio elements (and of their fallback links)", () => {
    const document = new DocumentNode([
      new AudioNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title=""><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></audio>')
  })

  specify("src attribute of videos (and of their fallback links)", () => {
    const document = new DocumentNode([
      new VideoNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title=""><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></video>')
  })

  specify("src attribute of images", () => {
    const document = new DocumentNode([
      new ImageNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="" src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title="">')
  })

  specify("title attribute of audio elements", () => {
    const document = new DocumentNode([
      new AudioNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></audio>')
  })

  specify("title attribute of videos", () => {
    const document = new DocumentNode([
      new VideoNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></video>')
  })

  specify("alt and title attributes of images", () => {
    const document = new DocumentNode([
      new ImageNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;" src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;">')
  })

  specify('href attribute of backlinks in footnote blocks', () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { footnoteReference: 'look "up" & read & remember' }
      }
    })

    const document = new DocumentNode([
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify('id attribute of footntoes in a footnote block', () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { footnote: 'look "down" & read & learn' }
      }
    })

    const document = new DocumentNode([
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("href attribute of a footnote reference's link", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { footnote: 'look "down" & read & learn' }
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    const html =
      '<p>'
      + '<sup class="up-footnote-reference" id="up&quot;&amp;&amp;&quot;footnote&quot;&amp;&amp;&quot;reference&quot;&amp;&amp;&quot;3">'
      + '<a href="#up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;down&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;read&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;learn&quot;&amp;&amp;&quot;3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify('id attribute of footnote references', () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { footnoteReference: 'look "up" & read & remember' }
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    const html =
      '<p>'
      + '<sup class="up-footnote-reference" id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;up&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;read&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;remember&quot;&amp;&amp;&quot;3">'
      + '<a href="#up&quot;&amp;&amp;&quot;footnote&quot;&amp;&amp;&quot;3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("id attribute of inline spoilers' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { spoiler: 'look "away" & smile & forget' }
      }
    })

    const document = new DocumentNode([
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("id attribute of inline NSFW conventions' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { nsfw: 'look "away" & smile & forget' }
      }
    })

    const document = new DocumentNode([
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("id attribute of inline NSFL conventions' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { nsfl: 'look "away" & smile & forget' }
      }
    })

    const document = new DocumentNode([
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("id attribute of spoiler blocks' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { spoiler: 'look "away" & smile & forget' }
      }
    })

    const document = new DocumentNode([
      new SpoilerBlockNode([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle spoiler</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("id attribute of NSFW blocks' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { nsfw: 'look "away" & smile & forget' }
      }
    })

    const document = new DocumentNode([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle NSFW</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("id attribute of NSFL blocks' checkboxes (and the 'for' attribute of their labels)", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { nsfl: 'look "away" & smile & forget' }
      }
    })

    const document = new DocumentNode([
      new NsflBlockNode([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">toggle NSFL</label>'
      + '<input id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify('the id attribute of elements referenced by the table of contents', () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '"&&"',
        terms: { itemReferencedByTableOfContents: 'look "away" & smile & forget' }
      }
    })

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const document =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    expect(up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up&quot;&amp;&amp;&quot;look&quot;&amp;&amp;&quot;&quot;away&quot;&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;smile&quot;&amp;&amp;&quot;&amp;&quot;&amp;&amp;&quot;forget&quot;&amp;&amp;&quot;1">I enjoy apples</h1>')
  })
})


describe("Within a link's href attribute, <, ', and >", () => {
  it("are not escaped", () => {
    const document = new DocumentNode([
      new ParagraphNode([
        new LinkNode([], "https://example.com/?z='<span>'")
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="https://example.com/?z=\'<span>\'"></a></p>')
  })
})
