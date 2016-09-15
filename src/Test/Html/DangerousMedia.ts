import { expect } from 'chai'
import * as Up from '../../index'
 

// TODO: The rules for "dangerous" media elements might be too cautious.

context('By default, media with dangerous URLs schemes produce no HTML.', () => {
  context('Images produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'data:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'file:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })
  })

  context('Audio conventions produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'data:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'file:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })
  })

  context('Videos produce no HTML if their scheme is:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'javascript:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'data:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'file:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'vbscript:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })
  })
})


context("When determining whether a media's URL is dangerous, the capitalization of the scheme does not matter.", () => {
  context('Images produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'jaVascriPt:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'DatA:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'fiLE:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Image('Uh-oh!', 'vBscRipt:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })
  })

  context('Audio conventions produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'JavascriPT:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'DAta:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'fILe:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Audio('Uh-oh!', 'vbScrIPt:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })
  })

  context('Videos produce no HTML if their URL scheme is any capitalization of:', () => {
    specify('javascript', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'jAvAscript:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('data', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'dATa:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('file', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'FiLe:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })

    specify('vbscript', () => {
      const document = new Up.Document([
        new Up.Video('Uh-oh!', 'VbscripT:malicious')
      ])

      expect(Up.render(document)).to.equal('')
    })
  })
})


context("An image's URL scheme can start with a dangerous scheme without being considered dangerous itself. For example:", () => {
  specify('javascript-app', () => {
    const document = new Up.Document([
      new Up.Image('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="Uh-oh!" src="javascript-app:stuff" title="Uh-oh!">')
  })

  specify('data-app', () => {
    const document = new Up.Document([
      new Up.Image('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="Uh-oh!" src="data-app:stuff" title="Uh-oh!">')
  })

  specify('file-app', () => {
    const document = new Up.Document([
      new Up.Image('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="Uh-oh!" src="file-app:stuff" title="Uh-oh!">')
  })

  specify('vbscript-app', () => {
    const document = new Up.Document([
      new Up.Image('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="Uh-oh!" src="vbscript-app:stuff" title="Uh-oh!">')
  })
})


context("An audio convention's URL scheme can start with a dangerous scheme without being considered dangerous itself. For example:", () => {
  specify('javascript-app', () => {
    const document = new Up.Document([
      new Up.Audio('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls loop src="javascript-app:stuff" title="Uh-oh!">'
      + '<a href="javascript-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('data-app', () => {
    const document = new Up.Document([
      new Up.Audio('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls loop src="data-app:stuff" title="Uh-oh!">'
      + '<a href="data-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('file-app', () => {
    const document = new Up.Document([
      new Up.Audio('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls loop src="file-app:stuff" title="Uh-oh!">'
      + '<a href="file-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })

  specify('vbscript-app', () => {
    const document = new Up.Document([
      new Up.Audio('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls loop src="vbscript-app:stuff" title="Uh-oh!">'
      + '<a href="vbscript-app:stuff">Uh-oh!</a>'
      + '</audio>')
  })
})


context("A video's URL scheme can start with a dangerous scheme without being considered dangerous itself. For example:", () => {
  specify('javascript-app', () => {
    const document = new Up.Document([
      new Up.Video('Uh-oh!', 'javascript-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls loop src="javascript-app:stuff" title="Uh-oh!">'
      + '<a href="javascript-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('data-app', () => {
    const document = new Up.Document([
      new Up.Video('Uh-oh!', 'data-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls loop src="data-app:stuff" title="Uh-oh!">'
      + '<a href="data-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('file-app', () => {
    const document = new Up.Document([
      new Up.Video('Uh-oh!', 'file-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls loop src="file-app:stuff" title="Uh-oh!">'
      + '<a href="file-app:stuff">Uh-oh!</a>'
      + '</video>')
  })

  specify('vbscript-app', () => {
    const document = new Up.Document([
      new Up.Video('Uh-oh!', 'vbscript-app:stuff')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls loop src="vbscript-app:stuff" title="Uh-oh!">'
      + '<a href="vbscript-app:stuff">Uh-oh!</a>'
      + '</video>')
  })
})
