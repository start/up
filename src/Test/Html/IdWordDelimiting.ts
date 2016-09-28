import { expect } from 'chai'
import * as Up from '../../index'


context('Words within HTML IDs are delimited by hyphens.', () => {
  context('This applies to terms appearing in IDs:', () => {
    specify('The "footnote" term', () => {
      const footnote = new Up.Footnote([
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const document = new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])

      const settings = {
        terms: { footnote: 'some extra info' }
      }

      expect(Up.render(document, settings)).to.equal(
        '<p>'
        + '<sup class="up-footnote-reference" id="up-footnote-reference-1">'
        + '<a href="#up-some-extra-info-1">1</a>'
        + '</sup>'
        + '</p>'
        + '<dl class="up-footnotes">'
        + '<dt id="up-some-extra-info-1"><a href="#up-footnote-reference-1">1</a></dt>'
        + '<dd>Well, I do, but I pretend not to.</dd>'
        + '</dl>')
    })

    specify('The "footnoteReference" term', () => {
      const footnote = new Up.Footnote([
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const document = new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])

      const settings = {
        terms: { footnoteReference: 'original footnote location' }
      }

      expect(Up.render(document, settings)).to.equal(
        '<p>'
        + '<sup class="up-footnote-reference" id="up-original-footnote-location-1">'
        + '<a href="#up-footnote-1">1</a>'
        + '</sup>'
        + '</p>'
        + '<dl class="up-footnotes">'
        + '<dt id="up-footnote-1"><a href="#up-original-footnote-location-1">1</a></dt>'
        + '<dd>Well, I do, but I pretend not to.</dd>'
        + '</dl>')
    })

    specify('The "sectionReferencedByTableOfContents" term', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const settings = {
        terms: { sectionReferencedByTableOfContents: 'table of contents entry' }
      }

      const { tableOfContentsHtml, documentHtml } =
        Up.renderDocumentAndTableOfContents(document, settings)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-table-of-contents-entry-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<h1 id="up-table-of-contents-entry-1">I enjoy apples</h1>')
    })
  })


  context('This applies to the "idPrefix" configuration setting, which is prefixed to every ID:', () => {
    specify('The ID of the checkboxes for inline revealables', () => {
      const document = new Up.Document([
        new Up.Paragraph([
          new Up.InlineRevealable([new Up.Text('45.9%')])
        ])
      ])

      const html =
        '<p>'
        + '<span class="up-spoiler up-revealable">'
        + '<label for="thread-11-reply-65-spoiler-1">toggle spoiler</label>'
        + '<input id="thread-11-reply-65-spoiler-1" role="button" type="checkbox">'
        + '<span role="alert">45.9%</span>'
        + '</span>'
        + '</p>'

      expect(Up.render(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })

    specify('The ID of the checkboxes for revealable blocks', () => {
      const document = new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([new Up.Text('45.9%')])
        ])
      ])

      const html =
        '<div class="up-spoiler up-revealable">'
        + '<label for="thread-11-reply-65-spoiler-1">toggle spoiler</label>'
        + '<input id="thread-11-reply-65-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert"><p>45.9%</p></div>'
        + '</div>'

      expect(Up.render(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })

    specify('Footnotes and footnote references', () => {
      const footnote = new Up.Footnote([
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const document = new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])

      expect(Up.render(document, { idPrefix: 'thread 11 reply 65' })).to.equal(
        '<p>'
        + '<sup class="up-footnote-reference" id="thread-11-reply-65-footnote-reference-1">'
        + '<a href="#thread-11-reply-65-footnote-1">1</a>'
        + '</sup>'
        + '</p>'
        + '<dl class="up-footnotes">'
        + '<dt id="thread-11-reply-65-footnote-1"><a href="#thread-11-reply-65-footnote-reference-1">1</a></dt>'
        + '<dd>Well, I do, but I pretend not to.</dd>'
        + '</dl>')
    })

    specify('The ID of elements referenced by the table of contents', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const settings = {
        idPrefix: 'thread 11 reply 65'
      }

      const { tableOfContentsHtml, documentHtml } =
        Up.renderDocumentAndTableOfContents(document, settings)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#thread-11-reply-65-topic-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<h1 id="thread-11-reply-65-topic-1">I enjoy apples</h1>')
    })
  })
})
