import { expect } from 'chai'
import Up from '../../index'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'


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

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com">Google<sup id="up-footnote-reference-2" class="up-footnote-reference">2</sup></a></p>')
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

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


context('Links nested within table of contents entries do not produce anchor elements. This applies to links within:', () => {
  specify('Headings', () => {
    const heading =
      new HeadingNode([new LinkNode([new PlainTextNode('I enjoy apples')], 'https://google.com')], 1)

    const documentNode =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-part-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-part-1"><a href="https://google.com">I enjoy apples</a></h1>')
  })
})
