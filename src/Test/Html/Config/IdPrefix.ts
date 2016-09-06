import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { SpoilerBlock } from '../../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../../SyntaxNodes/NsflBlock'
import { Heading } from '../../../SyntaxNodes/Heading'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'


describe("A footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(Up.toHtml(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-footnote-3">3</a></sup></p>')
  })

  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.toHtml(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="reply-11-footnote-reference-3"><a href="#reply-11-footnote-3">3</a></sup></p>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.toHtml(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="footnote-reference-3"><a href="#footnote-3">3</a></sup></p>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.toHtml(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="footnote-reference-3"><a href="#footnote-3">3</a></sup></p>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.toHtml(document)).to.equal(
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
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], { referenceNumber: 2 }),
          new Footnote([
            new PlainText("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.toHtml(document)).to.equal(html)
  })

  it("is prefixed with the provided ID prefix", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], { referenceNumber: 2 }),
          new Footnote([
            new PlainText("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="reply-11-footnote-2"><a href="#reply-11-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply-11-footnote-3"><a href="#reply-11-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], { referenceNumber: 2 }),
          new Footnote([
            new PlainText("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], { referenceNumber: 2 }),
          new Footnote([
            new PlainText("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], { referenceNumber: 2 }),
          new Footnote([
            new PlainText("Killer Bees")
          ], { referenceNumber: 3 })
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-2"><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-3"><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="reply-11-spoiler-1">toggle spoiler</label>'
      + '<input id="reply-11-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="spoiler-1">toggle spoiler</label>'
      + '<input id="spoiler-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="spoiler-1">toggle spoiler</label>'
      + '<input id="spoiler-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })


  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-spoiler-1">toggle spoiler</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("The ID of an inline NSFW conventions's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineNsfw([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfw([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="reply-11-nsfw-1">toggle NSFW</label>'
      + '<input id="reply-11-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfw([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="nsfw-1">toggle NSFW</label>'
      + '<input id="nsfw-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfw([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="nsfw-1">toggle NSFW</label>'
      + '<input id="nsfw-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })


  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfw([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfw-1">toggle NSFW</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("The ID of an inline NSFL conventions's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="reply-11-nsfl-1">toggle NSFL</label>'
      + '<input id="reply-11-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="nsfl-1">toggle NSFL</label>'
      + '<input id="nsfl-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="nsfl-1">toggle NSFL</label>'
      + '<input id="nsfl-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })


  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfl-1">toggle NSFL</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.equal(html)
  })
})




describe("The ID of a spoiler block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(Up.toHtml(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="reply-11-spoiler-1">toggle spoiler</label>'
      + '<input id="reply-11-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="spoiler-1">toggle spoiler</label>'
      + '<input id="spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="spoiler-1">toggle spoiler</label>'
      + '<input id="spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-spoiler-1">toggle spoiler</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("The ID of an NSFW block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(Up.toHtml(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document = new UpDocument([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="reply-11-nsfw-1">toggle NSFW</label>'
      + '<input id="reply-11-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document = new UpDocument([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="nsfw-1">toggle NSFW</label>'
      + '<input id="nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document = new UpDocument([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="nsfw-1">toggle NSFW</label>'
      + '<input id="nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document = new UpDocument([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfw-1">toggle NSFW</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("The ID of an NSFL block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(Up.toHtml(document)).to.equal(html)
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="reply-11-nsfl-1">toggle NSFL</label>'
      + '<input id="reply-11-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="nsfl-1">toggle NSFL</label>'
      + '<input id="nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="nsfl-1">toggle NSFL</label>'
      + '<input id="nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfl-1">toggle NSFL</label>'
      + '<input id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.equal(html)
  })
})


describe("The ID of an element referenced by the table of contents", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const heading = new Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const result = Up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<h1 id="up-topic-1"></h1>')
  })


  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const heading = new Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#reply-11-topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<h1 id="reply-11-topic-1"></h1>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const heading = new Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<h1 id="topic-1"></h1>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const heading = new Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<h1 id="topic-1"></h1>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const heading = new Heading([], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1"></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<h1 id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1"></h1>')
  })
})


describe("The URL of a reference to a table of contents entry (which is the ID of the actual entry in the document)", () => {
  it("is prefixed with the default ID prefix 'up' if one wasn't provided", () => {
    const heading = new Heading([
      new PlainText('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([new ReferenceToTableOfContentsEntry('howdy', heading)]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    const result = Up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<p><a href="#up-topic-1">Howdy there</a></p>'
      + '<h1 id="up-topic-1">Howdy there</h1>')
  })

  it("is prefixed with the ID prefix, if one was provided", () => {
    const up = new Up({
      idPrefix: 'reply-11'
    })

    const heading = new Heading([
      new PlainText('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([new ReferenceToTableOfContentsEntry('howdy', heading)]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#reply-11-topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<p><a href="#reply-11-topic-1">Howdy there</a></p>'
      + '<h1 id="reply-11-topic-1">Howdy there</h1>')
  })

  it("is not prefixed with a ID prefix if an empty prefix was provided", () => {
    const up = new Up({
      idPrefix: ''
    })

    const heading = new Heading([
      new PlainText('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([new ReferenceToTableOfContentsEntry('howdy', heading)]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<p><a href="#topic-1">Howdy there</a></p>'
      + '<h1 id="topic-1">Howdy there</h1>')
  })

  it("is not prefixed with a ID prefix if a blank prefix was provided", () => {
    const up = new Up({
      idPrefix: ' \t'
    })

    const heading = new Heading([
      new PlainText('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([new ReferenceToTableOfContentsEntry('howdy', heading)]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<p><a href="#topic-1">Howdy there</a></p>'
      + '<h1 id="topic-1">Howdy there</h1>')
  })

  it("is properly escaped if the ID prefix contains any ampersands or double quotes", () => {
    const up = new Up({
      idPrefix: '"reply" && "response"'
    })

    const heading = new Heading([
      new PlainText('Howdy there')
    ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([new ReferenceToTableOfContentsEntry('howdy', heading)]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    const result = up.toHtmlForDocumentAndTableOfContents(document)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
      '<p><a href="#&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</a></p>'
      + '<h1 id="&quot;reply&quot;-&amp;&amp;-&quot;response&quot;-topic-1">Howdy there</h1>')
  })
})
