import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Link } from '../../../SyntaxNodes/Link'
import { Image } from '../../../SyntaxNodes/Image'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Video } from '../../../SyntaxNodes/Video'


context('When the "renderUnsafeContent" config setting is set to true, links/media with dangerous URL schemes produce their regular HTML elements.', () => {
  const up = new Up({
    renderUnsafeContent: true
  })


  context('Links produce <a> elements even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new Paragraph([
          new Link([
            new PlainText('Click me!')
          ], 'javascript:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.equal(
        '<p><a href="javascript:malicious">Click me!</a></p>')
    })

    specify('data', () => {
      const document = new UpDocument([
        new Paragraph([
          new Link([
            new PlainText('Click me!')
          ], 'data:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.equal(
        '<p><a href="data:malicious">Click me!</a></p>')
    })

    specify('file', () => {
      const document = new UpDocument([
        new Paragraph([
          new Link([
            new PlainText('Click me!')
          ], 'file:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.equal(
        '<p><a href="file:malicious">Click me!</a></p>')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new Paragraph([
          new Link([
            new PlainText('Click me!')
          ], 'vbscript:malicious')
        ])
      ])

      expect(up.toHtml(document)).to.equal(
        '<p><a href="vbscript:malicious">Click me!</a></p>')
    })
  })


  specify('Because unsafe links produce <a> elements, any links nested inside unsafe lnks do not produce <a> elements.', () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new Link([
            new PlainText('Click me!')
          ], 'https://google.com')
        ], 'javascript:malicious')
      ])
    ])

    expect(up.toHtml(document)).to.equal(
      '<p><a href="javascript:malicious">Click me!</a></p>')
  })


  context('Images produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new Image('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<img alt="Uh-oh!" src="javascript:malicious" title="Uh-oh!">')
    })

    specify('data', () => {
      const document = new UpDocument([
        new Image('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<img alt="Uh-oh!" src="data:malicious" title="Uh-oh!">')
    })

    specify('file', () => {
      const document = new UpDocument([
        new Image('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<img alt="Uh-oh!" src="file:malicious" title="Uh-oh!">')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new Image('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<img alt="Uh-oh!" src="vbscript:malicious" title="Uh-oh!">')
    })
  })


  context('Audio conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<audio controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('data', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<audio controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('file', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<audio controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<audio controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</audio>')
    })
  })


  context('Video conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new Video('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<video controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('data', () => {
      const document = new UpDocument([
        new Video('Uh-oh!', 'data:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<video controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('file', () => {
      const document = new UpDocument([
        new Video('Uh-oh!', 'file:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<video controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new Video('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.toHtml(document)).to.equal(
        '<video controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</video>')
    })
  })
})
