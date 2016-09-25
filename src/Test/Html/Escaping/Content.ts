import { expect } from 'chai'
import * as Up from '../../../index'


describe('Within a text node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p>')
  })
})


describe('Within a text node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Text('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</p>')
  })
})


describe('Within a code block node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.CodeBlock('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
    ])

    expect(Up.render(document)).to.equal('<pre><code>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</code></pre>')
  })
})


describe('Within a code block node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.CodeBlock('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
    ])

    expect(Up.render(document)).to.equal('<pre><code>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</code></pre>')
  })
})


describe('Within an inline code node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineCode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><code>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</code></p>')
  })
})


describe('Within an inline code node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineCode('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><code>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</code></p>')
  })
})


describe('Within an example input node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.ExampleInput('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><kbd>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</kbd></p>')
  })
})


describe('Within an example input node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.ExampleInput('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><kbd>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</kbd></p>')
  })
})


describe("Within an inline spoiler's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleSpoiler: '<_< & show & hide' }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineSpoiler([])
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

    expect(up.render(document)).to.equal(html)
  })
})


describe("Within an inline NSFW convention's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleNsfw: '<_< & show & hide' }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineNsfw([])
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

    expect(up.render(document)).to.equal(html)
  })
})


describe("Within an inline NSFL convention's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleNsfl: '<_< & show & hide' }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineNsfl([])
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

    expect(up.render(document)).to.equal(html)
  })
})


describe("Within a spoiler block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleSpoiler: '<_< & show & hide' }
      }
    })

    const document = new Up.Document([
      new Up.SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })
})


describe("Within a NSFW block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleNsfw: '<_< & show & hide' }
      }
    })

    const document = new Up.Document([
      new Up.NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })
})


describe("Within a NSFL block's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleNsfl: '<_< & show & hide' }
      }
    })

    const document = new Up.Document([
      new Up.NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })
})


describe('Inside a text node itself nested within several inline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Emphasis([
          new Up.Stress([
            new Up.InlineQuote([
              new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p>'
      + '<em><strong><q>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</q></strong></em>'
      + '</p>')
  })
})


describe('Inside a text node itself nested within several outline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const document = new Up.Document([
      new Up.Blockquote([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])
    ])

    expect(Up.render(document)).to.equal('<blockquote><ul><li><p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p></li></ul></blockquote>')
  })
})


describe("Within a video's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const document = new Up.Document([
      new Up.Video('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', '')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls loop src="" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?"><a href="">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></video>')
  })
})


describe("Within an audio convention's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const document = new Up.Document([
      new Up.Audio('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', '')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls loop src="" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?"><a href="">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></audio>')
  })
})


context('Within a table of contents entry, all instances of < and & are escaped:', () => {
  specify('In the table of contents itself', () => {
    const heading =
      new Up.Heading([
        new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</h1>')
  })

  specify('In a section link referencing that table of contents entry', () => {
    const heading =
      new Up.Heading([
        new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        new Up.Paragraph([
          new Up.SectionLink('coincidence', heading)
        ]),
        heading
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p><a href="#up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></p>'
      + '<h1 id="up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</h1>')
  })
})


context('Within a section link that was never actually associated with an entry', () => {
  specify('all instances of all instances of < and & are escaped', () => {
    const document =
      new Up.Document([
        new Up.Paragraph([
          new Up.SectionLink('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
        ])
      ])

    expect(Up.render(document)).to.equal(
      '<p>'
      + '<i>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</i>'
      + '</p>')
  })
})
