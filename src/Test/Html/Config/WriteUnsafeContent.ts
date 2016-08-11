import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'


context('When the "writeUnsafeContent" config setting is set to true, links/media with dangerous URL schemes produce their regular HTML elements.', () => {
  const up = new Up({
    writeUnsafeContent: true
  })

  context('Links produce <a> elements even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new DocumentNode([
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
      const document = new DocumentNode([
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
      const document = new DocumentNode([
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
      const document = new DocumentNode([
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
    const document = new DocumentNode([
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
      const document = new DocumentNode([
        new ImageNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img src="javascript:malicious" alt="Uh-oh!" title="Uh-oh!">')
    })

    specify('data', () => {
      const document = new DocumentNode([
        new ImageNode('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img src="data:malicious" alt="Uh-oh!" title="Uh-oh!">')
    })

    specify('file', () => {
      const document = new DocumentNode([
        new ImageNode('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img src="file:malicious" alt="Uh-oh!" title="Uh-oh!">')
    })

    specify('vbscript', () => {
      const document = new DocumentNode([
        new ImageNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<img src="vbscript:malicious" alt="Uh-oh!" title="Uh-oh!">')
    })
  })


  context('Audio conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new DocumentNode([
        new AudioNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('data', () => {
      const document = new DocumentNode([
        new AudioNode('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('file', () => {
      const document = new DocumentNode([
        new AudioNode('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('vbscript', () => {
      const document = new DocumentNode([
        new AudioNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<audio controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</audio>')
    })
  })


  context('Video conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new DocumentNode([
        new VideoNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('data', () => {
      const document = new DocumentNode([
        new VideoNode('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('file', () => {
      const document = new DocumentNode([
        new VideoNode('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('vbscript', () => {
      const document = new DocumentNode([
        new VideoNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.be.eql(
        '<video controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</video>')
    })
  })
})
