import { expect } from 'chai'
import Up from '../../../index'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'


describe("A footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("are prefixed with the default document name 'up' if one wasn't provided", () => {   
    const node = new FootnoteNode([], 3)

    expect(Up.toHtml(node)).to.be.eql(
      '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>')
  })

  it("are prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="reply-11-footnote-reference-3" class="up-footnote-reference"><a href="#reply-11-footnote-3">3</a></sup>')
  })

  it("are not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="footnote-reference-3" class="up-footnote-reference"><a href="#footnote-3">3</a></sup>')
  })
})


describe("A footnote's ID (as well as the ID of the footnote reference pointing to it)", () => {
  it("are prefixed with the default document name 'up' if one wasn't provided", () => {
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })

  it("are prefixed with the provided document name", () => {
    const up = new Up({
      documentName: 'reply-11'
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="reply-11-footnote-2"><a href="#reply-11-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply-11-footnote-3"><a href="#reply-11-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })

  it("are not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of a spoiler's checkbox (on both the checkbox and the label)", () => {
  it("are prefixed with the default document name 'up' if one wasn't provided", () => {
    const node = new SpoilerNode([])
    
    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })


  it("are prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const node = new SpoilerNode([])
    
    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="reply-11-spoiler-1">toggle spoiler</label>'
      + '<input id="reply-11-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })

  it("are not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const node = new SpoilerNode([])
    
    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="spoiler-1">toggle spoiler</label>'
      + '<input id="spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of a NSFW conventions's checkbox (on both the checkbox and the label)", () => {
  it("are prefixed with the default document name 'up' if one wasn't provided", () => {
    const node = new NsfwNode([])
    
    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle nsfw</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })


  it("are prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const node = new NsfwNode([])
    
    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="reply-11-nsfw-1">toggle nsfw</label>'
      + '<input id="reply-11-nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })

  it("are not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const node = new NsfwNode([])
    
    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="nsfw-1">toggle nsfw</label>'
      + '<input id="nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of a NSFL conventions's checkbox (on both the checkbox and the label)", () => {
  it("are prefixed with the default document name 'up' if one wasn't provided", () => {
    const node = new NsflNode([])
    
    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle nsfl</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })


  it("are prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })

    const node = new NsflNode([])
    
    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="reply-11-nsfl-1">toggle nsfl</label>'
      + '<input id="reply-11-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })

  it("are not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })

    const node = new NsflNode([])
    
    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="nsfl-1">toggle nsfl</label>'
      + '<input id="nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
