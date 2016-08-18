import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


context('Words within HTML IDs are delimited by hyphens.', () => {
  context('This applies to terms appearing in IDs:', () => {
    specify('The "footnote" term', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)

      const document = new UpDocument([
        new ParagraphNode([footnote]),
        new FootnoteBlockNode([footnote])
      ])

      const config = {
        terms: {
          footnote: 'some extra info'
        }
      }

      expect(Up.toHtml(document, config)).to.be.eql(
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
    })

    specify('The "itemReferencedByTableOfContents" term', () => {
      const heading =
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

      const document =
        new UpDocument([heading], new UpDocument.TableOfContents([heading]))

      const config = {
        terms: {
          itemReferencedByTableOfContents: 'table of contents entry'
        }
      }

      expect(Up.toHtml(document, config)).to.be.eql(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-table-of-contents-entry-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>'
        + '<h1 id="up-table-of-contents-entry-1">I enjoy apples</h1>')
    })
  })


  context('This applies to the "documentName" configuration setting, which is prefixed to every ID:', () => {
    specify('The ID of the checkboxes for inline spoilers', () => {
      const document = new UpDocument([
        new ParagraphNode([
          new InlineSpoilerNode([new PlainTextNode('45.9%')])
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

      expect(Up.toHtml(document, { documentName: 'thread 11 reply 65' })).to.be.eql(html)
    })

    specify('The ID of the checkboxes for inline NSFW conventions', () => {
      const document = new UpDocument([
        new ParagraphNode([
          new InlineNsfwNode([new PlainTextNode('45.9%')])
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

      expect(Up.toHtml(document, { documentName: 'thread 11 reply 65' })).to.be.eql(html)
    })

    specify('The ID of the checkboxes for inline NSFL conventions', () => {
      const document = new UpDocument([
        new ParagraphNode([
          new InlineNsflNode([new PlainTextNode('45.9%')])
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

      expect(Up.toHtml(document, { documentName: 'thread 11 reply 65' })).to.be.eql(html)
    })

    specify('The ID of the checkboxes for spoiler blocks', () => {
      const document = new UpDocument([
        new SpoilerBlockNode([
          new ParagraphNode([new PlainTextNode('45.9%')])
        ])
      ])

      const html =
        '<div class="up-spoiler up-revealable">'
        + '<label for="thread-11-reply-65-spoiler-1">toggle spoiler</label>'
        + '<input id="thread-11-reply-65-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert"><p>45.9%</p></div>'
        + '</div>'

      expect(Up.toHtml(document, { documentName: 'thread 11 reply 65' })).to.be.eql(html)
    })

    specify('The ID of the checkboxes for NSFW blocks', () => {
      const document = new UpDocument([
        new NsfwBlockNode([
          new ParagraphNode([new PlainTextNode('45.9%')])
        ])
      ])

      const html =
        '<div class="up-nsfw up-revealable">'
        + '<label for="thread-11-reply-65-nsfw-1">toggle NSFW</label>'
        + '<input id="thread-11-reply-65-nsfw-1" role="button" type="checkbox">'
        + '<div role="alert"><p>45.9%</p></div>'
        + '</div>'

      expect(Up.toHtml(document, { documentName: 'thread 11 reply 65' })).to.be.eql(html)
    })

    specify('The ID of the checkboxes for NSFL blocks', () => {
      const document = new UpDocument([
        new NsflBlockNode([
          new ParagraphNode([new PlainTextNode('45.9%')])
        ])
      ])

      const html =
        '<div class="up-nsfl up-revealable">'
        + '<label for="thread-11-reply-65-nsfl-1">toggle NSFL</label>'
        + '<input id="thread-11-reply-65-nsfl-1" role="button" type="checkbox">'
        + '<div role="alert"><p>45.9%</p></div>'
        + '</div>'

      expect(Up.toHtml(document, { documentName: 'thread 11 reply 65' })).to.be.eql(html)
    })

    specify('The ID of elements referenced by the table of contents', () => {
      const heading =
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

      const document =
        new UpDocument([heading], new UpDocument.TableOfContents([heading]))

      expect(Up.toHtml(document, { documentName: 'thread 11 reply 65' })).to.be.eql(
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
