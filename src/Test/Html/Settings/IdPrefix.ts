import { expect } from 'chai'
import * as Up from '../../../Up'


describe("A footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-footnote-3">3</a></sup></p>')
  })

  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: 'reply-11' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="reply-11-footnote-reference-3"><a href="#reply-11-footnote-3">3</a></sup></p>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="footnote-reference-3"><a href="#footnote-3">3</a></sup></p>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: ' \t' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="footnote-reference-3"><a href="#footnote-3">3</a></sup></p>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p>'
      + '<sup class="up-footnote-reference" id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-reference-3">'
      + '<a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-3">3</a>'
      + '</sup>'
      + '</p>')
  })
})


describe("A footnote's ID (as well as the ID of the footnote reference pointing to it)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document =
      new Up.Document([
        new Up.FootnoteBlock([
          new Up.Footnote([
            new Up.Text("Arwings")
          ], { referenceNumber: 2 }),
          new Up.Footnote([
            new Up.Text("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.render(document)).to.equal(html)
  })

  it("is prefixed with the provided ID prefix", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: 'reply-11' }
    })

    const document =
      new Up.Document([
        new Up.FootnoteBlock([
          new Up.Footnote([
            new Up.Text("Arwings")
          ], { referenceNumber: 2 }),
          new Up.Footnote([
            new Up.Text("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="reply-11-footnote-2"><a href="#reply-11-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply-11-footnote-3"><a href="#reply-11-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '' }
    })

    const document =
      new Up.Document([
        new Up.FootnoteBlock([
          new Up.Footnote([
            new Up.Text("Arwings")
          ], { referenceNumber: 2 }),
          new Up.Footnote([
            new Up.Text("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: ' \t' }
    })

    const document =
      new Up.Document([
        new Up.FootnoteBlock([
          new Up.Footnote([
            new Up.Text("Arwings")
          ], { referenceNumber: 2 }),
          new Up.Footnote([
            new Up.Text("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const document =
      new Up.Document([
        new Up.FootnoteBlock([
          new Up.Footnote([
            new Up.Text("Arwings")
          ], { referenceNumber: 2 }),
          new Up.Footnote([
            new Up.Text("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-2"><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-3"><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })
})


describe("The ID of an inline revealable's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<label for="up-revealable-1">reveal</label>'
      + '<input id="up-revealable-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(Up.render(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: 'reply-11' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<label for="reply-11-revealable-1">reveal</label>'
      + '<input id="reply-11-revealable-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.render(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<label for="revealable-1">reveal</label>'
      + '<input id="revealable-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.render(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: ' \t' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<label for="revealable-1">reveal</label>'
      + '<input id="revealable-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.render(document)).to.equal(html)
  })


  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1">reveal</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.render(document)).to.equal(html)
  })
})


describe("The ID of a revealable block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new Up.Document([
      new Up.RevealableBlock([])
    ])

    const html =
      '<div class="up-revealable">'
      + '<label for="up-revealable-1">reveal</label>'
      + '<input id="up-revealable-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(Up.render(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: 'reply-11' }
    })

    const document = new Up.Document([
      new Up.RevealableBlock([])
    ])

    const html =
      '<div class="up-revealable">'
      + '<label for="reply-11-revealable-1">reveal</label>'
      + '<input id="reply-11-revealable-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '' }
    })

    const document = new Up.Document([
      new Up.RevealableBlock([])
    ])

    const html =
      '<div class="up-revealable">'
      + '<label for="revealable-1">reveal</label>'
      + '<input id="revealable-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: ' \t' }
    })

    const document = new Up.Document([
      new Up.RevealableBlock([])
    ])

    const html =
      '<div class="up-revealable">'
      + '<label for="revealable-1">reveal</label>'
      + '<input id="revealable-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const document = new Up.Document([
      new Up.RevealableBlock([])
    ])

    const html =
      '<div class="up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1">reveal</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })
})


describe("The ID of an element referenced by the table of contents", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const heading = new Up.Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1"></h1>')
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: 'reply-11' }
    })

    const heading = new Up.Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#reply-11-topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="reply-11-topic-1"></h1>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '' }
    })

    const heading = new Up.Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="topic-1"></h1>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: ' \t' }
    })

    const heading = new Up.Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="topic-1"></h1>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const heading = new Up.Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1"></h1>')
  })
})


describe("The URL of a section link (which is the ID of the actual entry in the document)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p><a href="#up-topic-1">Howdy there</a></p>'
      + '<h1 id="up-topic-1">Howdy there</h1>')
  })

  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: 'reply-11' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#reply-11-topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p><a href="#reply-11-topic-1">Howdy there</a></p>'
      + '<h1 id="reply-11-topic-1">Howdy there</h1>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p><a href="#topic-1">Howdy there</a></p>'
      + '<h1 id="topic-1">Howdy there</h1>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: ' \t' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p><a href="#topic-1">Howdy there</a></p>'
      + '<h1 id="topic-1">Howdy there</h1>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Transformer({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</a></p>'
      + '<h1 id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</h1>')
  })
})
