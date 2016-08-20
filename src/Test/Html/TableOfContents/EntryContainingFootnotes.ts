import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


context("Within the table of contents itself", () => {
  specify('footnotes produce no HTML (they are totally ignored).', () => {
    const topLevelFootnote =
      new Footnote([new PlainText('Sometimes')], 1)

    const nestedFootnote =
      new Footnote([new PlainText('Always')], 2)

    const heading =
      new Heading([
        new PlainText('I enjoy apples'),
        topLevelFootnote,
        new PlainText(' '),
        new Emphasis([
          new PlainText('and you should too'),
          nestedFootnote
        ])
      ], 1)

    const document =
      new UpDocument([
        heading,
        new FootnoteBlock([topLevelFootnote, nestedFootnote])
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples <em>and you should too</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1">'
      + 'I enjoy apples'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-1">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-2">'
      + '<a href="#up-footnote-2">2</a>'
      + '</sup>'
      + '</em>'
      + '</h1>'
      + '<dl class="up-footnotes">'
      + '<dt id="up-footnote-1"><a href="#up-footnote-reference-1">1</a></dt><dd>Sometimes</dd>'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Always</dd>'
      + '</dl>')
  })
})
