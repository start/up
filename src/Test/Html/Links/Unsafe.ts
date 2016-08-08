import { expect } from 'chai'
import Up from '../../../index'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


context('By default, links with unsafe schemes produce no <a> elements. Instead, their contents are included directly into their outer element. These unsafe URL schemes are:', () => {
  specify('javascript', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'javascript:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })

  specify('data', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'data:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })

  specify('file', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'file:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })

  specify('vbscript', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'vbscript:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p>Click me!</p>')
  })
})


context('Though by default, links with unsafe schemes produce no HTML, link URLs can contain unsafe schemes:', () => {
  specify('javascript', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=javascript:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com/?q=javascript:malicious">Click me!</a></p>')
  })

  specify('data', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=data:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com/?q=data:malicious">Click me!</a></p>')
  })

  specify('file', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=file:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com/?q=file:malicious">Click me!</a></p>')
  })

  specify('vbscript', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=vbscript:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com/?q=vbscript:malicious">Click me!</a></p>')
  })
})


describe('By default, a safe link nested inside an unsafe link', () => {
  it('produces an <a> element', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new LinkNode([
            new PlainTextNode('Click me!')
          ], 'https://google.com')
        ], 'data:malicious')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com">Click me!</a></p>')
  })
})
