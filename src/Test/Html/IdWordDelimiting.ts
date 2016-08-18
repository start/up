import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
/*import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'*/


context('Words within HTML IDs are delimited by hyphens.', () => {
  context('This applies to terms appearing in IDs:', () => {
    specify('The "footnote" term', () => {
    })

    specify('The "footnoteReference" term', () => {
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
    })

    specify('The ID of the checkboxes for NSFW blocks', () => {
    })

    specify('The ID of the checkboxes for NSFL blocks', () => {
    })

    specify('The ID of elements referenced by the table of contents', () => {
    })
  })
})
