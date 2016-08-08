import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


context('By default, media with unsafe URLs schemes produce no HTML.', () => {
  context('Images produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })

  context('Audio conventions produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })

  context('Videos produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })
})


context("When determining whether a media's URL is unsafe, the capitalization of the scheme does not matter.", () => {
  context('Images produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'jaVascriPt:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'DatA:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'fiLE:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
        new ImageNode('Uh-oh!', 'vBscRipt:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })

  context('Audio conventions produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'JavascriPT:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'DAta:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'fILe:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
        new AudioNode('Uh-oh!', 'vbScrIPt:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })

  context('Videos produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'jAvAscript:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('data', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'dATa:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('file', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'FiLe:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })

    specify('vbscript', () => {
      const documentNode = new DocumentNode([
        new VideoNode('Uh-oh!', 'VbscripT:malicious')
      ])

      expect(Up.toHtml(documentNode)).to.be.eql('')
    })
  })
})


context("An image's URL is not considered unsafe if its scheme starts with", () => {
  specify('javascript-app', () => {
    const documentNode = new DocumentNode([
      new ImageNode('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<img src="javascript-app:stuff" alt="Uh-oh!" title="Uh-oh!">')
  })

  specify('data-app', () => {
    const documentNode = new DocumentNode([
      new ImageNode('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<img src="data-app:stuff" alt="Uh-oh!" title="Uh-oh!">')
  })

  specify('file-app', () => {
    const documentNode = new DocumentNode([
      new ImageNode('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<img src="file-app:stuff" alt="Uh-oh!" title="Uh-oh!">')
  })

  specify('vbscript-app', () => {
    const documentNode = new DocumentNode([
      new ImageNode('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<img src="vbscript-app:stuff" alt="Uh-oh!" title="Uh-oh!">')
  })
})


context("An audio convention's URL is not considered unsafe if its scheme starts with", () => {
  specify('javascript-app', () => {
    const documentNode = new DocumentNode([
      new AudioNode('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<audio src="javascript-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="javascript-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('data-app', () => {
    const documentNode = new DocumentNode([
      new AudioNode('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<audio src="data-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="data-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('file-app', () => {
    const documentNode = new DocumentNode([
      new AudioNode('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<audio src="file-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="file-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('vbscript-app', () => {
    const documentNode = new DocumentNode([
      new AudioNode('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<audio src="vbscript-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="vbscript-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })
})


context("A video's URL is not considered unsafe if its scheme starts with", () => {
  specify('javascript-app', () => {
    const documentNode = new DocumentNode([
      new VideoNode('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<video src="javascript-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="javascript-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('data-app', () => {
    const documentNode = new DocumentNode([
      new VideoNode('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<video src="data-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="data-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('file-app', () => {
    const documentNode = new DocumentNode([
      new VideoNode('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<video src="file-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="file-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('vbscript-app', () => {
    const documentNode = new DocumentNode([
      new VideoNode('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<video src="vbscript-app:stuff" title="Uh-oh!" controls loop>'
      + '<a href="vbscript-app:stuff">Uh-oh!</a>'
      + '</video>')
  })
})
