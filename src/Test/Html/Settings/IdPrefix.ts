import { expect } from 'chai'
import * as Up from '../../../Main'


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
    const up = new Up.Up({
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
    const up = new Up.Up({
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
    const up = new Up.Up({
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
    const up = new Up.Up({
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
    const up = new Up.Up({
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
    const up = new Up.Up({
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
    const up = new Up.Up({
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
    const up = new Up.Up({
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


describe("The IDs and names of elements rendered for inline revealables", () => {
  const document = new Up.Document([
    new Up.Paragraph([
      new Up.InlineRevealable([
        new Up.Text('45.9%')
      ])
    ])
  ])

  it("are prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    expect(Up.render(document)).to.equal(
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">45.9%</span>'
      + '</span>'
      + '</p>')
  })

  it("are prefixed with the ID prefix, if one was provided", () => {
    expect(Up.render(document, { idPrefix: 'reply-11' })).to.equal(
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="reply-11-hide-button-1" name="reply-11-revealable-1" type="radio">'
      + '<label for="reply-11-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="reply-11-reveal-button-1" name="reply-11-revealable-1" type="radio">'
      + '<label for="reply-11-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">45.9%</span>'
      + '</span>'
      + '</p>')
  })

  it("are not prefixed with a ID prefix if an empty prefix was provided", () => {
    expect(Up.render(document, { idPrefix: '' })).to.equal(
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="hide-button-1" name="revealable-1" type="radio">'
      + '<label for="hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="reveal-button-1" name="revealable-1" type="radio">'
      + '<label for="reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">45.9%</span>'
      + '</span>'
      + '</p>')
  })

  it("are not prefixed with a ID prefix if a blank prefix was provided", () => {
    expect(Up.render(document, { idPrefix: '' })).to.equal(
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="hide-button-1" name="revealable-1" type="radio">'
      + '<label for="hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="reveal-button-1" name="revealable-1" type="radio">'
      + '<label for="reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">45.9%</span>'
      + '</span>'
      + '</p>')
  })

  it("are properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    expect(Up.render(document, { idPrefix: '"reply" && "response"' })).to.equal(
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-hide-button-1" name="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1" type="radio">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-reveal-button-1" name="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1" type="radio">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">45.9%</span>'
      + '</span>'
      + '</p>')
  })
})


describe("The IDs and names of elements rendered for revealable blocks", () => {
  const document = new Up.Document([
    new Up.RevealableBlock([
      new Up.Paragraph([
        new Up.Text('45.9%')
      ])
    ])
  ])

  it("are prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    expect(Up.render(document)).to.equal(
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert"><p>45.9%</p></div>'
      + '</div>')
  })

  it("are prefixed with the ID prefix, if one was provided", () => {
    expect(Up.render(document, { idPrefix: 'reply-11' })).to.equal(
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="reply-11-hide-button-1" name="reply-11-revealable-1" type="radio">'
      + '<label for="reply-11-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="reply-11-reveal-button-1" name="reply-11-revealable-1" type="radio">'
      + '<label for="reply-11-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert"><p>45.9%</p></div>'
      + '</div>')
  })

  it("are not prefixed with a ID prefix if an empty prefix was provided", () => {
    expect(Up.render(document, { idPrefix: '' })).to.equal(
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="hide-button-1" name="revealable-1" type="radio">'
      + '<label for="hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="reveal-button-1" name="revealable-1" type="radio">'
      + '<label for="reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert"><p>45.9%</p></div>'
      + '</div>')
  })

  it("are not prefixed with a ID prefix if a blank prefix was provided", () => {
    expect(Up.render(document, { idPrefix: '' })).to.equal(
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="hide-button-1" name="revealable-1" type="radio">'
      + '<label for="hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="reveal-button-1" name="revealable-1" type="radio">'
      + '<label for="reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert"><p>45.9%</p></div>'
      + '</div>')
  })

  it("are properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    expect(Up.render(document, { idPrefix: '"reply" && "response"' })).to.equal(
      '<div class="up-revealable">'
      + '<input checked class="up-hide" id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-hide-button-1" name="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1" type="radio">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-reveal-button-1" name="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-revealable-1" type="radio">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert"><p>45.9%</p></div>'
      + '</div>')
  })
})


const NOT_USED: string = null

describe("The ID of an element referenced by the table of contents", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const heading = new Up.Heading([], {
      level: 1,
      titleMarkup: NOT_USED,
      ordinalInTableOfContents: 1
    })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1"></a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1"></h1>')
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up.Up({
      rendering: { idPrefix: 'reply-11' }
    })

    const heading = new Up.Heading([], {
      level: 1,
      titleMarkup: NOT_USED,
      ordinalInTableOfContents: 1
    })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#reply-11-topic-1"></a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="reply-11-topic-1"></h1>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Up({
      rendering: { idPrefix: '' }
    })

    const heading = new Up.Heading([], {
      level: 1,
      titleMarkup: NOT_USED,
      ordinalInTableOfContents: 1
    })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#topic-1"></a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="topic-1"></h1>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Up({
      rendering: { idPrefix: ' \t' }
    })

    const heading = new Up.Heading([], {
      level: 1,
      titleMarkup: NOT_USED,
      ordinalInTableOfContents: 1
    })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#topic-1"></a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="topic-1"></h1>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Up({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const heading = new Up.Heading([], {
      level: 1,
      titleMarkup: NOT_USED,
      ordinalInTableOfContents: 1
    })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1"></a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1"></h1>')
  })
})


describe("The URL of a section link (which is the ID of the actual entry in the document)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], {
        level: 1,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">Howdy there</a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#up-topic-1">Howdy there</a></p>'
      + '<h1 id="up-topic-1">Howdy there</h1>')
  })

  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up.Up({
      rendering: { idPrefix: 'reply-11' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], {
        level: 1,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#reply-11-topic-1">Howdy there</a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#reply-11-topic-1">Howdy there</a></p>'
      + '<h1 id="reply-11-topic-1">Howdy there</h1>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up.Up({
      rendering: { idPrefix: '' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], {
        level: 1,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#topic-1">Howdy there</a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#topic-1">Howdy there</a></p>'
      + '<h1 id="topic-1">Howdy there</h1>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up.Up({
      rendering: { idPrefix: ' \t' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], {
        level: 1,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#topic-1">Howdy there</a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#topic-1">Howdy there</a></p>'
      + '<h1 id="topic-1">Howdy there</h1>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up.Up({
      rendering: { idPrefix: '"reply" && "response"' }
    })

    const heading = new Up.Heading([
      new Up.Text('Howdy there')
    ], {
        level: 1,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('howdy', heading)]),
        heading,
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</a></p>'
      + '<h1 id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</h1>')
  })
})
