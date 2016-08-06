import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'



describe('Within a plain text node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const node = new DocumentNode([
      new ParagraphNode([
        new PlainTextNode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.toHtml(node)).to.be.eql('<p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p>')
  })
})


describe('Within a plain text node, >, \', and "', () => {
  it('are preserved', () => {
    const text = 'John said, "1 and 2 > 0. I can\'t believe it."'
    const node = new DocumentNode([
      new ParagraphNode([
        new PlainTextNode(text)
      ])
    ])
    expect(Up.toHtml(node)).to.be.eql(text)
  })
})


describe("Within an inline spoiler's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      i18n: {
        terms: { toggleSpoiler: '<_< & show & hide' }
      }
    })

    const node = new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Within an inline NSFW convention's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfw: '<_< & show & hide' }
      }
    })

    const node = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Within an inline NSFL convention's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfl: '<_< & show & hide' }
      }
    })

    const node = new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Within a spoiler block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      i18n: {
        terms: { toggleSpoiler: '<_< & show & hide' }
      }
    })

    const node = new SpoilerBlockNode([])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Within a NSFW block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfw: '<_< & show & hide' }
      }
    })

    const node = new NsfwBlockNode([])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Within a NSFL block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfl: '<_< & show & hide' }
      }
    })

    const node = new NsflBlockNode([])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe('Inside a plain text node itself nested within several inline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const node = new DocumentNode([
      new ParagraphNode([
        new EmphasisNode([
          new StressNode([
            new RevisionDeletionNode([
              new PlainTextNode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])
    ])

    expect(Up.toHtml(node)).to.be.eql('<p><em><strong><del>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</del></strong></em></p>')
  })
})


describe('Inside a plain text node itself nested within several outline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const node =
      new BlockquoteNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])

    expect(Up.toHtml(node)).to.be.eql('<blockquote><ul><li><p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p></li></ul></blockquote>')
  })
})


describe("Within a video's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const node = new VideoNode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', '')

    expect(Up.toHtml(node)).to.be.eql(
      '<video src="" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?" controls loop><a href="">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></video>')
  })
})


describe("Within an audio convention's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const node = new AudioNode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', '')

    expect(Up.toHtml(node)).to.be.eql(
      '<audio src="" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?" controls loop><a href="">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></audio>')
  })
})
