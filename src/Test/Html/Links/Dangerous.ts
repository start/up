import { expect } from 'chai'
import Up = require('../../../index')


context('By default, links with dangerous schemes produce no <a> elements. Instead, their contents are included directly into their outer element. These dangerous URL schemes are:', () => {
  specify('javascript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'javascript:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })

  specify('data', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'data:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })

  specify('file', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'file:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })

  specify('vbscript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'vbscript:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })
})


context('Though by default, links with dangerous schemes produce no HTML, link URLs can contain dangerous schemes:', () => {
  specify('javascript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'https://google.com/?q=javascript:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com/?q=javascript:malicious">Click me!</a></p>')
  })

  specify('data', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'https://google.com/?q=data:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com/?q=data:malicious">Click me!</a></p>')
  })

  specify('file', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'https://google.com/?q=file:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com/?q=file:malicious">Click me!</a></p>')
  })

  specify('vbscript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'https://google.com/?q=vbscript:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com/?q=vbscript:malicious">Click me!</a></p>')
  })
})


context("When determining whether a link's URL is dangerous, the capitalization of the scheme does not matter. Links do not produce <a> elements if their URL scheme is any capitalization of:", () => {
  specify('javascript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'jaVAscrIpT:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })

  specify('data', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'dAtA:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })

  specify('file', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'FilE:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })

  specify('vbscript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'VbScriPt:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>Click me!</p>')
  })
})


describe('By default, a safe link nested inside a dangerous link', () => {
  it('produces an <a> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Link([
            new Up.PlainText('Click me!')
          ], 'https://google.com')
        ], 'data:malicious')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com">Click me!</a></p>')
  })
})


context("A link's URL scheme can start with a dangerous scheme without being considered dangerous itself. For example:", () => {
  specify('javascript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'javascript-app:stuff')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><a href="javascript-app:stuff">Click me!</a></p>')
  })

  specify('data', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'data-app:stuff')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><a href="data-app:stuff">Click me!</a></p>')
  })

  specify('file', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'file-app:stuff')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><a href="file-app:stuff">Click me!</a></p>')
  })

  specify('vbscript', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.PlainText('Click me!')
        ], 'vbscript-app:stuff')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><a href="vbscript-app:stuff">Click me!</a></p>')
  })
})
