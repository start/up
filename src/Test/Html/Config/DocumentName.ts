import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'

describe("A footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<p><sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup></p>')
  })

  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(up.toHtml(documentNode)).to.be.eql(
      '<p><sup id="reply-11-footnote-reference-3" class="up-footnote-reference"><a href="#reply-11-footnote-3">3</a></sup></p>')
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(up.toHtml(documentNode)).to.be.eql(
      '<p><sup id="footnote-reference-3" class="up-footnote-reference"><a href="#footnote-3">3</a></sup></p>')
  })
})


describe("A footnote's ID (as well as the ID of the footnote reference pointing to it)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode =
      new DocumentNode([
        new FootnoteBlockNode([
          new FootnoteNode([
            new PlainTextNode("Arwings")
          ], 2),
          new FootnoteNode([
            new PlainTextNode("Killer Bees")
          ], 3)
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is prefixed with the provided document name", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode =
      new DocumentNode([
        new FootnoteBlockNode([
          new FootnoteNode([
            new PlainTextNode("Arwings")
          ], 2),
          new FootnoteNode([
            new PlainTextNode("Killer Bees")
          ], 3)
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="reply-11-footnote-2"><a href="#reply-11-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply-11-footnote-3"><a href="#reply-11-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode =
      new DocumentNode([
        new FootnoteBlockNode([
          new FootnoteNode([
            new PlainTextNode("Arwings")
          ], 2),
          new FootnoteNode([
            new PlainTextNode("Killer Bees")
          ], 3)
        ])
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="reply-11-spoiler-1">toggle spoiler</label>'
      + '<input id="reply-11-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="spoiler-1">toggle spoiler</label>'
      + '<input id="spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The ID of an inline NSFW conventions's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="reply-11-nsfw-1">toggle NSFW</label>'
      + '<input id="reply-11-nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="nsfw-1">toggle NSFW</label>'
      + '<input id="nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The ID of an inline NSFL conventions's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="reply-11-nsfl-1">toggle NSFL</label>'
      + '<input id="reply-11-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="nsfl-1">toggle NSFL</label>'
      + '<input id="nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})




describe("The ID of a spoiler block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode = new DocumentNode([
      new SpoilerBlockNode([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode = new DocumentNode([
      new SpoilerBlockNode([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="reply-11-spoiler-1">toggle spoiler</label>'
      + '<input id="reply-11-spoiler-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode = new DocumentNode([
      new SpoilerBlockNode([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="spoiler-1">toggle spoiler</label>'
      + '<input id="spoiler-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The ID of an NSFW block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode = new DocumentNode([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode = new DocumentNode([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="reply-11-nsfw-1">toggle NSFW</label>'
      + '<input id="reply-11-nsfw-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode = new DocumentNode([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="nsfw-1">toggle NSFW</label>'
      + '<input id="nsfw-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The ID of an NSFL block's checkbox (on both the checkbox and the label)", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const documentNode = new DocumentNode([
      new NsflBlockNode([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const documentNode = new DocumentNode([
      new NsflBlockNode([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="reply-11-nsfl-1">toggle NSFL</label>'
      + '<input id="reply-11-nsfl-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const documentNode = new DocumentNode([
      new NsflBlockNode([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="nsfl-1">toggle NSFL</label>'
      + '<input id="nsfl-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})



describe("The ID of an element referenced by the table of contents", () => {
  it("is prefixed with the default document name 'up' if one wasn't provided", () => {
    const heading = new HeadingNode([], 1)

    const documentNode =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    const html =
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-part-1"></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-part-1"></h1>'

    expect(Up.toHtml(documentNode)).to.be.eql(html)
  })


  it("is prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const heading = new HeadingNode([], 1)

    const documentNode =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    const html =
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#reply-11-part-1"></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="reply-11-part-1"></h1>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })

  it("is not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const heading = new HeadingNode([], 1)

    const documentNode =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    const html =
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#part-1"></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="part-1"></h1>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})
