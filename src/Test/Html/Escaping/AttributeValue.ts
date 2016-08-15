import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


context('Within any attribute value, all instances of " and & are escaped. Specifically, within the', () => {
  specify("src attribute of links", () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([], 'https://example.com/?x&y&z="hi"')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></p>')
  })

  specify("src attribute of audio elements (and of their fallback links)", () => {
    const document = new UpDocument([
      new AudioNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title=""><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></audio>')
  })

  specify("src attribute of videos (and of their fallback links)", () => {
    const document = new UpDocument([
      new VideoNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title=""><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></video>')
  })

  specify("src attribute of images", () => {
    const document = new UpDocument([
      new ImageNode('', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="" src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title="">')
  })

  specify("title attribute of audio elements", () => {
    const document = new UpDocument([
      new AudioNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></audio>')
  })

  specify("title attribute of videos", () => {
    const document = new UpDocument([
      new VideoNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></video>')
  })

  specify("alt and title attributes of images", () => {
    const document = new UpDocument([
      new ImageNode('John said, "1 and 2 > 0. I can\'t believe it."', '')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;" src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;">')
  })

  specify('href attribute of backlinks in footnote blocks', () => {
    const up = new Up({
      terms: { footnoteReference: 'look "up" & read & remember' }
    })

    const document = new UpDocument([
      new FootnoteBlockNode([
        new FootnoteNode([], 2)
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2">'
      + '<a href="#up-look-&quot;up&quot;-&amp;-read-&amp;-remember-2">2</a>'
      + '</dt><dd></dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify('id attribute of footntoes in a footnote block', () => {
    const up = new Up({
      terms: { footnote: 'look "down" & read & learn' }
    })

    const document = new UpDocument([
      new FootnoteBlockNode([
        new FootnoteNode([], 2)
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-look-&quot;down&quot;-&amp;-read-&amp;-learn-2">'
      + '<a href="#up-footnote-reference-2">2</a>'
      + '</dt><dd></dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify("href attribute of a footnote reference's link", () => {
    const up = new Up({
      terms: { footnote: 'look "down" & read & learn' }
    })

    const document = new UpDocument([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    const html =
      '<p>'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-3">'
      + '<a href="#up-look-&quot;down&quot;-&amp;-read-&amp;-learn-3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify('id attribute of footnote references', () => {
    const up = new Up({
      terms: { footnoteReference: 'look "up" & read & remember' }
    })

    const document = new UpDocument([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    const html =
      '<p>'
      + '<sup class="up-footnote-reference" id="up-look-&quot;up&quot;-&amp;-read-&amp;-remember-3">'
      + '<a href="#up-footnote-3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  specify('the id attribute of elements referenced by the table of contents', () => {
    const up = new Up({
      terms: { itemReferencedByTableOfContents: 'look "away" & smile & forget' }
    })

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-look-&quot;away&quot;-&amp;-smile-&amp;-forget-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-look-&quot;away&quot;-&amp;-smile-&amp;-forget-1">I enjoy apples</h1>')
  })
})


describe("Within a link's href attribute, <, ', and >", () => {
  it("are not escaped", () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([], "https://example.com/?z='<span>'")
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="https://example.com/?z=\'<span>\'"></a></p>')
  })
})
