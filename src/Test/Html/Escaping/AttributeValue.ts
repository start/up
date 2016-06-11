import { expect } from 'chai'
import Up from '../../../index'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe("Within a link's src attribute, all instances of \" and &", () => {
  it("are escaped by replacing them with &quot; and &amp;", () => {
    const node = new LinkNode([], 'https://example.com/?x&y&z="hi"')

    expect(Up.toHtml(node)).to.be.eql(
      '<a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a>')
  })
})


describe("Within a link's href attribute, <, ', and >", () => {
  it("are not escaped", () => {
    const node = new LinkNode([], "https://example.com/?z='<span>'")

    expect(Up.toHtml(node)).to.be.eql(
      '<a href="https://example.com/?z=\'<span>\'"></a>')
  })
})


describe("Within an audio convention's src attribute, all instances of \" and &", () => {
  it("are escaped (and they're escaped within the fallback link src attribute)", () => {
    const node = new AudioNode('', 'https://example.com/?x&y&z="hi"')

    expect(Up.toHtml(node)).to.be.eql(
      '<audio src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title=""><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></audio>')
  })
})


describe("Within a video's src attribute, all instances of \" and &", () => {
  it("are escaped (and they're escaped within the fallback link src attribute)", () => {
    const node = new VideoNode('', 'https://example.com/?x&y&z="hi"')

    expect(Up.toHtml(node)).to.be.eql(
      '<video src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title=""><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></video>')
  })
})


describe("Within an image's src attribute, all instances of \" and &", () => {
  it("are escaped", () => {
    const node = new ImageNode('', 'https://example.com/?x&y&z="hi"')

    expect(Up.toHtml(node)).to.be.eql(
      '<img src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" alt="" title="">')
  })
})


describe("Within a video's title attribute, all instances of \" and &", () => {
  it("are escaped (but they're not escaped within the fallback link's contents)", () => {
    const node = new VideoNode('John said, "1 and 2 > 0. I can\'t believe it."', '')

    expect(Up.toHtml(node)).to.be.eql(
      '<video src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></video>')
  })
})


describe("Within an audio convention's title attribute, all instances of \" and &", () => {
  it("are escaped (but they're not escaped within the fallback link's contents)", () => {
    const node = new AudioNode('John said, "1 and 2 > 0. I can\'t believe it."', '')

    expect(Up.toHtml(node)).to.be.eql(
      '<audio src="" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;"><a href="">John said, "1 and 2 > 0. I can\'t believe it."</a></audio>')
  })
})


describe("Within an image's title and alt attributes, all instances of \" and &", () => {
  it("are escaped", () => {
    const node = new ImageNode('John said, "1 and 2 > 0. I can\'t believe it."', '')

    expect(Up.toHtml(node)).to.be.eql(
      '<img src="" alt="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;">')
  })
})


describe("Within the href attribute of a backlink in a footnote block (which contains the 'footnoteReference' config term), all instances of \" and &", () => {
  it('are escaped', () => {
    const up = new Up({
      i18n: {
        terms: { footnoteReference: 'look "up" & read & remember' }
      }
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([], 2)
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-look-&quot;up&quot;-&amp;-read-&amp;-remember-2">2</a></dt><dd></dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Within the id attribute of a footnote in a footnote block (which contains the 'footnote' config term), all instances of \" and &", () => {
  it('are escaped', () => {
    const up = new Up({
      i18n: {
        terms: { footnote: 'look "down" & read & learn' }
      }
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([], 2)
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-look-&quot;down&quot;-&amp;-read-&amp;-learn-2"><a href="#up-footnote-reference-2">2</a></dt><dd></dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Within the href attribute of a footnote reference's link (which contains the 'footnote' config term), all instances of \" and &", () => {
  it('are escaped', () => {
    const up = new Up({
      i18n: {
        terms: { footnote: 'look "down" & read & learn' }
      }
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-look-&quot;down&quot;-&amp;-read-&amp;-learn-3">3</a></sup>')
  })
})


describe("Within the id attribute of a footnote reference (which contains the 'footnoteReference' config term), all instances of \" and &", () => {
  it('are escaped', () => {
    const up = new Up({
      i18n: {
        terms: { footnoteReference: 'look "up" & read & remember' }
      }
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="up-look-&quot;up&quot;-&amp;-read-&amp;-remember-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>')
  })
})