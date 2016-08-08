import { expect } from 'chai'
import Up from '../../../index'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


context('By default, links with unsafe protocols produce no <a> elements. Instead, their contents are included directly into their outer element. Unsafe link protocols are:', () => {
  specify('javascript', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!'),
        ], 'javascript:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })

  specify('data', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!'),
        ], 'data:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })

  specify('file', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!'),
        ], 'file:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })

  specify('vbscript', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!'),
        ], 'vbscript:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })
})