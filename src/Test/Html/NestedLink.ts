import { expect } from 'chai'
import Up from '../../index'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'


context('Inside a link', () => {
  specify("a footnote does not produce another link element. The footnote's <sup> directly contains the footnote's reference number", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Google'),
          new FootnoteNode([new PlainTextNode('A really old search engine.')], 2)
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<a href="https://google.com">Google<sup id="up-footnote-reference-2" class="up-footnote-reference">2</sup></a>')
  })

  specify("a nested link does not produce another link element. The nested link's contents are included directly inside the outer link", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Google is probably not '),
          new LinkNode([new PlainTextNode('Bing')], 'https://bing.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<a href="https://google.com">Google is probably not Bing</a>')
  })
})
