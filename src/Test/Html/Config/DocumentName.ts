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

describe("A footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-footnote-3">3</a></sup></p>')
  })

  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="reply-11-footnote-reference-3"><a href="#reply-11-footnote-3">3</a></sup></p>')
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="footnote-reference-3"><a href="#footnote-3">3</a></sup></p>')
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="footnote-reference-3"><a href="#footnote-3">3</a></sup></p>')
  })
})


describe("A footnote's ID (as well as the ID of the footnote reference pointing to it)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], 2),
          new Footnote([
            new PlainText("Killer Bees")
          ], 3)
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })

  it("is prefixed with the provided document name", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], 2),
          new Footnote([
            new PlainText("Killer Bees")
          ], 3)
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="reply-11-footnote-2"><a href="#reply-11-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply-11-footnote-3"><a href="#reply-11-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
    })

    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], 2),
          new Footnote([
            new PlainText("Killer Bees")
          ], 3)
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const document =
      new UpDocument([
        new FootnoteBlock([
          new Footnote([
            new PlainText("Arwings")
          ], 2),
          new Footnote([
            new PlainText("Killer Bees")
          ], 3)
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
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

    expect(Up.toHtml(document)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The ID of an inline NSFW conventions's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
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

    expect(Up.toHtml(document)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The ID of an inline NSFL conventions's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
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

    expect(Up.toHtml(document)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })
})




describe("The ID of a spoiler block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The ID of an NSFW block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The ID of an NSFL block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
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

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
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

    expect(up.toHtml(document)).to.be.eql(html)
  })
})



describe("The ID of an element referenced by the table of contents", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const heading = new Heading([], { level: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const html =
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1"></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1"></h1>'

    expect(Up.toHtml(document)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const heading = new Heading([], { level: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const html =
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#reply-11-item-1"></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="reply-11-item-1"></h1>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if an empty name was provided", () => {
    const up = new Up({
      documentName: ''
    })

    const heading = new Heading([], { level: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const html =
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#item-1"></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="item-1"></h1>'

    expect(up.toHtml(document)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const heading = new Heading([], { level: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    const html =
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#item-1"></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="item-1"></h1>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})
