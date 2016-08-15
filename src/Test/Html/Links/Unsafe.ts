import { expect } from 'chai'
import Up from '../../../index'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


context('By default, links with unsafe schemes produce no <a> elements. Instead, their contents are included directly into their outer element. These unsafe URL schemes are:', () => {
  specify('javascript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'javascript:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })

  specify('data', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'data:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })

  specify('file', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'file:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })

  specify('vbscript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'vbscript:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })
})


context('Though by default, links with unsafe schemes produce no HTML, link URLs can contain unsafe schemes:', () => {
  specify('javascript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=javascript:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com/?q=javascript:malicious">Click me!</a></p>')
  })

  specify('data', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=data:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com/?q=data:malicious">Click me!</a></p>')
  })

  specify('file', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=file:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com/?q=file:malicious">Click me!</a></p>')
  })

  specify('vbscript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'https://google.com/?q=vbscript:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com/?q=vbscript:malicious">Click me!</a></p>')
  })
})


context("When determining whether a link's URL is unsafe, the capitalization of the scheme does not matter. Links do not produce <a> elements if their URL scheme is any capitalization of:", () => {
  specify('javascript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'jaVAscrIpT:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })

  specify('data', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'dAtA:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })

  specify('file', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'FilE:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })

  specify('vbscript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'VbScriPt:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p>Click me!</p>')
  })
})


describe('By default, a safe link nested inside an unsafe link', () => {
  it('produces an <a> element', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new LinkNode([
            new PlainTextNode('Click me!')
          ], 'https://google.com')
        ], 'data:malicious')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com">Click me!</a></p>')
  })
})


context("A link's URL scheme can start with an unsafe scheme without being considered unsafe itself. For example:", () => {
  specify('javascript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'javascript-app:stuff')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="javascript-app:stuff">Click me!</a></p>')
  })

  specify('data', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'data-app:stuff')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="data-app:stuff">Click me!</a></p>')
  })

  specify('file', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'file-app:stuff')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="file-app:stuff">Click me!</a></p>')
  })

  specify('vbscript', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Click me!')
        ], 'vbscript-app:stuff')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="vbscript-app:stuff">Click me!</a></p>')
  })
})
