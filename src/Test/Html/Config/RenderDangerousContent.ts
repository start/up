import { expect } from 'chai'
import * as Up from '../../../index'


context('When the "renderDangerousContent" setting is enabled, links/media with dangerous URL schemes produce their regular HTML elements.', () => {
  const up = new Up.Converter({
    rendering: {
      renderDangerousContent: true
    }
  })


  context('Links produce <a> elements even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Paragraph([
          new Up.Link([
            new Up.PlainText('Click me!')
          ], 'javascript:malicious')
        ])
      ])

      expect(up.render(document)).to.equal(
        '<p><a href="javascript:malicious">Click me!</a></p>')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Paragraph([
          new Up.Link([
            new Up.PlainText('Click me!')
          ], 'data:malicious')
        ])
      ])

      expect(up.render(document)).to.equal(
        '<p><a href="data:malicious">Click me!</a></p>')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Paragraph([
          new Up.Link([
            new Up.PlainText('Click me!')
          ], 'file:malicious')
        ])
      ])

      expect(up.render(document)).to.equal(
        '<p><a href="file:malicious">Click me!</a></p>')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Paragraph([
          new Up.Link([
            new Up.PlainText('Click me!')
          ], 'vbscript:malicious')
        ])
      ])

      expect(up.render(document)).to.equal(
        '<p><a href="vbscript:malicious">Click me!</a></p>')
    })
  })


  specify('Because dangerous links produce <a> elements, any links nested inside dangerous lnks do not produce <a> elements.', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Link([
            new Up.PlainText('Click me!')
          ], 'https://google.com')
        ], 'javascript:malicious')
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p><a href="javascript:malicious">Click me!</a></p>')
  })


  context('Images produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<img alt="Uh-oh!" src="javascript:malicious" title="Uh-oh!">')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'data:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<img alt="Uh-oh!" src="data:malicious" title="Uh-oh!">')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'file:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<img alt="Uh-oh!" src="file:malicious" title="Uh-oh!">')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<img alt="Uh-oh!" src="vbscript:malicious" title="Uh-oh!">')
    })
  })


  context('Audio conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<audio controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'data:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<audio controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'file:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<audio controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</audio>')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<audio controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</audio>')
    })
  })


  context('Video conventions produce HTML even if their scheme is:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'javascript:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<video controls loop src="javascript:malicious" title="Uh-oh!">'
        + '<a href="javascript:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'data:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<video controls loop src="data:malicious" title="Uh-oh!">'
        + '<a href="data:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'file:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<video controls loop src="file:malicious" title="Uh-oh!">'
        + '<a href="file:malicious">Uh-oh!</a>'
        + '</video>')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'vbscript:malicious')
      ])

      expect(up.render(document)).to.equal(
        '<video controls loop src="vbscript:malicious" title="Uh-oh!">'
        + '<a href="vbscript:malicious">Uh-oh!</a>'
        + '</video>')
    })
  })
})
