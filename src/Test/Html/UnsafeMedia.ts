import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { Audio } from '../../SyntaxNodes/Audio'
import { VideoNode } from '../../SyntaxNodes/VideoNode'


context('By default, media with unsafe URLs schemes produce no HTML.', () => {
  context('Images produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('data', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('file', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })
  })

  context('Audio conventions produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('data', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('file', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })
  })

  context('Videos produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('data', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'data:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('file', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'file:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })
  })
})


context("When determining whether a media's URL is unsafe, the capitalization of the scheme does not matter.", () => {
  context('Images produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'jaVascriPt:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('data', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'DatA:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('file', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'fiLE:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new ImageNode('Uh-oh!', 'vBscRipt:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })
  })

  context('Audio conventions produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'JavascriPT:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('data', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'DAta:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('file', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'fILe:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new Audio('Uh-oh!', 'vbScrIPt:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })
  })

  context('Videos produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'jAvAscript:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('data', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'dATa:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('file', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'FiLe:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })

    specify('vbscript', () => {
      const document = new UpDocument([
        new VideoNode('Uh-oh!', 'VbscripT:malicious')
      ])

      expect(Up.toHtml(document)).to.be.eql('')
    })
  })
})


context("An image's URL scheme can start with an unsafe scheme without being considered unsafe itself. For example:", () => {
  specify('javascript-app', () => {
    const document = new UpDocument([
      new ImageNode('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="Uh-oh!" src="javascript-app:stuff" title="Uh-oh!">')
  })

  specify('data-app', () => {
    const document = new UpDocument([
      new ImageNode('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="Uh-oh!" src="data-app:stuff" title="Uh-oh!">')
  })

  specify('file-app', () => {
    const document = new UpDocument([
      new ImageNode('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="Uh-oh!" src="file-app:stuff" title="Uh-oh!">')
  })

  specify('vbscript-app', () => {
    const document = new UpDocument([
      new ImageNode('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<img alt="Uh-oh!" src="vbscript-app:stuff" title="Uh-oh!">')
  })
})


context("An audio convention's URL scheme can start with an unsafe scheme without being considered unsafe itself. For example:", () => {
  specify('javascript-app', () => {
    const document = new UpDocument([
      new Audio('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="javascript-app:stuff" title="Uh-oh!">'
      + '<a href="javascript-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('data-app', () => {
    const document = new UpDocument([
      new Audio('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="data-app:stuff" title="Uh-oh!">'
      + '<a href="data-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('file-app', () => {
    const document = new UpDocument([
      new Audio('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="file-app:stuff" title="Uh-oh!">'
      + '<a href="file-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('vbscript-app', () => {
    const document = new UpDocument([
      new Audio('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<audio controls loop src="vbscript-app:stuff" title="Uh-oh!">'
      + '<a href="vbscript-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })
})


context("A video's URL scheme can start with an unsafe scheme without being considered unsafe itself. For example:", () => {
  specify('javascript-app', () => {
    const document = new UpDocument([
      new VideoNode('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="javascript-app:stuff" title="Uh-oh!">'
      + '<a href="javascript-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('data-app', () => {
    const document = new UpDocument([
      new VideoNode('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="data-app:stuff" title="Uh-oh!">'
      + '<a href="data-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('file-app', () => {
    const document = new UpDocument([
      new VideoNode('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="file-app:stuff" title="Uh-oh!">'
      + '<a href="file-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('vbscript-app', () => {
    const document = new UpDocument([
      new VideoNode('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<video controls loop src="vbscript-app:stuff" title="Uh-oh!">'
      + '<a href="vbscript-app:stuff">Uh-oh!</a>'
      + '</video>')
  })
})
