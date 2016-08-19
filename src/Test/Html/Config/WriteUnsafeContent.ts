import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { Audio } from '../../../SyntaxNodes/Audio'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'


context('When the "writeUnsafeContent" config setting is set to true, links/media with dangerous URL schemes produce their regular HTML elements.', () => {
  const up = new Up({
    writeUnsafeContent: true
  })

  context('Links produce <a> elements even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new ParagraphNode([
          new LinkNode([
            new PlainTextNode('Click me!')
          ], 'javascript:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<p><a href="javascript:malicious">Click me!</a></p>')
    })

    specify('data', () => {
      const document = new UpDocument([
        new ParagraphNode([
          new LinkNode([
            new PlainTextNode('Click me!')
          ], 'data:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<p><a href="data:malicious">Click me!</a></p>')
    })

    specify('file', () => {
      const document = new UpDocument([
        new ParagraphNode([
          new LinkNode([
            new PlainTextNode('Click me!')
          ], 'file:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<p><a href="file:malicious">Click me!</a></p>')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new ParagraphNode([
          new LinkNode([
            new PlainTextNode('Click me!')
          ], 'vbscript:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<p><a href="vbscript:malicious">Click me!</a></p>')
    })
  })


  specify('Because unsafe links produce <a> elements, any links nested inside unsafe lnks do not produce <a> elements.', () => {
    const document = new UpDocument([
      new ParagraphNode([
        new LinkNode([
          new LinkNode([
            new PlainTextNode('Click me!')
          ], 'https://google.com')
        ], 'javascript:malicious')
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><a href="javascript:malicious">Click me!</a></p>')
  })


  context('Images produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img alt="Uh-oh!" src="javascript:malicious" title="Uh-oh!">')
    })

    specify('data', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img alt="Uh-oh!" src="data:malicious" title="Uh-oh!">')
    })

    specify('file', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img alt="Uh-oh!" src="file:malicious" title="Uh-oh!">')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img alt="Uh-oh!" src="vbscript:malicious" title="Uh-oh!">')
    })
  })


  context('Audio conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('data', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('file', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</audio>')
    })
  })


  context('Video conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('data', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('file', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</video>')
    })
  })
})
