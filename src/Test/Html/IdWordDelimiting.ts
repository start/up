import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { Heading } from '../../SyntaxNodes/Heading'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'


context('Words within HTML IDs are delimited by hyphens.', () => {
  context('This applies to terms appearing in IDs:', () => {
    specify('The "footnote" term', () => {
      const footnote = new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const document = new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])

      const config = {
        terms: {
          output: { footnote: 'some extra info' }
        }
      }

      expect(Up.toHtml(document, config)).to.equal(
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
      const footnote = new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const document = new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])

      const config = {
        terms: {
          output: { footnoteReference: 'original footnote location' }
        }
      }

      expect(Up.toHtml(document, config)).to.equal(
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

    specify('The "itemReferencedByTableOfContents" term', () => {
      const heading =
        new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const document =
        new UpDocument([heading], new UpDocument.TableOfContents([heading]))

      const config = {
        terms: {
          output: { itemReferencedByTableOfContents: 'table of contents entry' }
        }
      }

      expect(Up.toHtml(document, config)).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-table-of-contents-entry-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>'
        + '<h1 id="up-table-of-contents-entry-1">I enjoy apples</h1>')
    })
  })


  context('This applies to the "idPrefix" configuration setting, which is prefixed to every ID:', () => {
    specify('The ID of the checkboxes for inline spoilers', () => {
      const document = new UpDocument([
        new Paragraph([
          new InlineSpoiler([new PlainText('45.9%')])
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

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })

    specify('The ID of the checkboxes for inline NSFW conventions', () => {
      const document = new UpDocument([
        new Paragraph([
          new InlineNsfw([new PlainText('45.9%')])
        ])
      ])

      const html =
        '<p>'
        + '<span class="up-nsfw up-revealable">'
        + '<label for="thread-11-reply-65-nsfw-1">toggle NSFW</label>'
        + '<input id="thread-11-reply-65-nsfw-1" role="button" type="checkbox">'
        + '<span role="alert">45.9%</span>'
        + '</span>'
        + '</p>'

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })

    specify('The ID of the checkboxes for inline NSFL conventions', () => {
      const document = new UpDocument([
        new Paragraph([
          new InlineNsfl([new PlainText('45.9%')])
        ])
      ])

      const html =
        '<p>'
        + '<span class="up-nsfl up-revealable">'
        + '<label for="thread-11-reply-65-nsfl-1">toggle NSFL</label>'
        + '<input id="thread-11-reply-65-nsfl-1" role="button" type="checkbox">'
        + '<span role="alert">45.9%</span>'
        + '</span>'
        + '</p>'

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })

    specify('The ID of the checkboxes for spoiler blocks', () => {
      const document = new UpDocument([
        new SpoilerBlock([
          new Paragraph([new PlainText('45.9%')])
        ])
      ])

      const html =
        '<div class="up-spoiler up-revealable">'
        + '<label for="thread-11-reply-65-spoiler-1">toggle spoiler</label>'
        + '<input id="thread-11-reply-65-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert"><p>45.9%</p></div>'
        + '</div>'

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })

    specify('The ID of the checkboxes for NSFW blocks', () => {
      const document = new UpDocument([
        new NsfwBlock([
          new Paragraph([new PlainText('45.9%')])
        ])
      ])

      const html =
        '<div class="up-nsfw up-revealable">'
        + '<label for="thread-11-reply-65-nsfw-1">toggle NSFW</label>'
        + '<input id="thread-11-reply-65-nsfw-1" role="button" type="checkbox">'
        + '<div role="alert"><p>45.9%</p></div>'
        + '</div>'

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })

    specify('The ID of the checkboxes for NSFL blocks', () => {
      const document = new UpDocument([
        new NsflBlock([
          new Paragraph([new PlainText('45.9%')])
        ])
      ])

      const html =
        '<div class="up-nsfl up-revealable">'
        + '<label for="thread-11-reply-65-nsfl-1">toggle NSFL</label>'
        + '<input id="thread-11-reply-65-nsfl-1" role="button" type="checkbox">'
        + '<div role="alert"><p>45.9%</p></div>'
        + '</div>'

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(html)
    })
    specify('Footnotes and footnote references', () => {
      const footnote = new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const document = new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(
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
        new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const document =
        new UpDocument([heading], new UpDocument.TableOfContents([heading]))

      expect(Up.toHtml(document, { idPrefix: 'thread 11 reply 65' })).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#thread-11-reply-65-item-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>'
        + '<h1 id="thread-11-reply-65-item-1">I enjoy apples</h1>')
    })
  })
})
