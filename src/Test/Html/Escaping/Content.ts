import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'
import { UnorderedList } from '../../../SyntaxNodes/UnorderedList'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ExampleInput } from '../../../SyntaxNodes/ExampleInput'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'
import { CodeBlock } from '../../../SyntaxNodes/CodeBlock'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Stress } from '../../../SyntaxNodes/Stress'
import { RevisionDeletion } from '../../../SyntaxNodes/RevisionDeletion'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { SpoilerBlock } from '../../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../../SyntaxNodes/NsflBlock'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'
import { Video } from '../../../SyntaxNodes/Video'
import { Audio } from '../../../SyntaxNodes/Audio'


describe('Within a plain text node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new UpDocument([
      new Paragraph([
        new PlainText('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p>')
  })
})


describe('Within a plain text node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new UpDocument([
      new Paragraph([
        new PlainText('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</p>')
  })
})


describe('Within a code block node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new UpDocument([
      new CodeBlock('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
    ])

    expect(Up.toHtml(document)).to.equal('<pre><code>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</code></pre>')
  })
})


describe('Within a code block node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new UpDocument([
      new CodeBlock('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
    ])

    expect(Up.toHtml(document)).to.equal('<pre><code>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</code></pre>')
  })
})


describe('Within an inline code node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineCode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p><code>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</code></p>')
  })
})


describe('Within an inline code node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineCode('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p><code>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</code></p>')
  })
})


describe('Within an example input node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new UpDocument([
      new Paragraph([
        new ExampleInput('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p><kbd>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</kbd></p>')
  })
})


describe('Within an example input node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new UpDocument([
      new Paragraph([
        new ExampleInput('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p><kbd>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</kbd></p>')
  })
})


describe("Within an inline spoiler's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      terms: {
        output: {
          toggleSpoiler: '<_< & show & hide'
        }
      }
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("Within an inline NSFW convention's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      terms: {
        output: {
          toggleNsfw: '<_< & show & hide'
        }
      }
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfw([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("Within an inline NSFL convention's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      terms: {
        output: {
          toggleNsfl: '<_< & show & hide'
        }
      }
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("Within a spoiler block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      terms: {
        output: {
          toggleSpoiler: '<_< & show & hide'
        }
      }
    })

    const document = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("Within a NSFW block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      terms: {
        output: {
          toggleNsfw: '<_< & show & hide'
        }
      }
    })

    const document = new UpDocument([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("Within a NSFL block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      terms: {
        output: {
          toggleNsfl: '<_< & show & hide'
        }
      }
    })

    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe('Inside a plain text node itself nested within several inline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const document = new UpDocument([
      new Paragraph([
        new Emphasis([
          new Stress([
            new RevisionDeletion([
              new PlainText('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p><em><strong><del>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</del></strong></em></p>')
  })
})


describe('Inside a plain text node itself nested within several outline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const document = new UpDocument([
      new Blockquote([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<blockquote><ul><li><p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p></li></ul></blockquote>')
  })
})


describe("Within a video's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const document = new UpDocument([
      new Video('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', '')
    ])

    expect(Up.toHtml(document)).to.equal(
      '<video controls loop src="" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?"><a href="">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></video>')
  })
})


describe("Within an audio convention's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const document = new UpDocument([
      new Audio('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', '')
    ])

    expect(Up.toHtml(document)).to.equal(
      '<audio controls loop src="" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?"><a href="">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></audio>')
  })
})


context('Within a table of contents entry, all instances of < and & are escaped:', () => {
  specify('In the table of contents itself', () => {
    const heading =
      new Heading([
        new PlainText('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</h1>')
  })

  specify('In a reference to that table of contents entry', () => {
    const heading =
      new Heading([
        new PlainText('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([
          new ReferenceToTableOfContentsEntry('coincidence', heading)
        ]),
        heading
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<p><a href="#up-item-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></p>'
      + '<h1 id="up-item-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</h1>')
  })
})


context('Within a table of contents entry reference that was never actually associated with an entry', () => {
  specify('all instances of all instances of < and & are escaped', () => {
    const document =
      new UpDocument([
        new Paragraph([
          new ReferenceToTableOfContentsEntry('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
        ])
      ])

    expect(Up.toHtml(document)).to.equal(
      '<p>'
      + '<i>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</i>'
      + '</p>')
  })
})
