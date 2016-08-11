import { expect } from 'chai'
import Up from '../../../index'
import { UpConfigSettings } from '../../../UpConfigSettings'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    textForConfigChanges: string
    textForDefaultSettings: string
    configChanges: UpConfigSettings
    conflictingConfigChanges: UpConfigSettings
  }
): void {
  const { textForConfigChanges, textForDefaultSettings, configChanges, conflictingConfigChanges } = args

  // First, let's just make sure the caller is expecting their config changes to make a difference
  expect(textForConfigChanges).to.not.be.eql(textForDefaultSettings)

  const whenEverythingIsDefault =
    Up.toAst(textForDefaultSettings)


  describe("when provided to the default toAst method", () => {
    it("does not alter subsequent calls to the default method", () => {
      expect(Up.toAst(textForConfigChanges, configChanges)).to.be.eql(Up.toAst(textForDefaultSettings))
    })

    it("replaces the original config term", () => {
      expect(Up.toAst(textForDefaultSettings, configChanges)).to.not.be.eql(whenEverythingIsDefault)
    })
  })


  describe("when provided to an Up object's toAst method", () => {
    const up = new Up(configChanges)

    it("does not alter the Up object's original settings", () => {
      // Let's make sure the conflicting changes actually were conflicting
      expect(up.toAst(textForConfigChanges, conflictingConfigChanges)).to.not.be.eql(whenEverythingIsDefault)

      // And now let's make sure those conflicting changes didn't overwrite the original settings!
      expect(up.toAst(textForConfigChanges)).to.be.eql(whenEverythingIsDefault)
    })

    it("replaces the original config term", () => {
      expect(up.toAst(textForDefaultSettings)).to.not.be.eql(whenEverythingIsDefault)
    })
  })


  const up = new Up(configChanges)

  const whenProvidingChangesAtCreation =
    up.toAst(textForConfigChanges)


  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the term when calling the default toAst method', () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(Up.toAst(textForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toAst method", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up().toAst(textForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toAst method, overwriting the term provided at creation", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up(conflictingConfigChanges).toAst(textForConfigChanges, configChanges))
    })

    it("replaces the original config term", () => {
      expect(up.toAst(textForDefaultSettings)).to.not.be.eql(whenEverythingIsDefault)
    })
  })
}


describe('The "audio" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]',
    textForDefaultSettings: '[audio: chanting at Nevada caucus][https://example.com/audio.ogg]',
    configChanges: {
      i18n: {
        terms: { audio: 'listen' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { audio: 'sound' }
      }
    }
  })
})


describe('The "image" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: '[see: Chrono Cross logo][https://example.com/cc.png]',
    textForDefaultSettings: '[image: Chrono Cross logo][https://example.com/cc.png]',
    configChanges: {
      i18n: {
        terms: { image: 'see' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { image: 'picture' }
      }
    }
  })
})


describe('The "video" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: '[watch: Nevada caucus footage][https://example.com/video.webm]',
    textForDefaultSettings: '[video: Nevada caucus footage][https://example.com/video.webm]',
    configChanges: {
      i18n: {
        terms: { video: 'watch' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { video: 'observe' }
      }
    }
  })
})


describe('The "highlight" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: '[mark: Ash fights Gary]',
    textForDefaultSettings: '[highlight: Ash fights Gary]',
    configChanges: {
      i18n: {
        terms: { highlight: 'mark' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { highlight: 'paint' }
      }
    }
  })
})


describe('The "spoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: '[RUINS ENDING: Ash fights Gary]',
    textForDefaultSettings: '[SPOILER: Ash fights Gary]',
    configChanges: {
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { spoiler: 'look away' }
      }
    }
  })
})


describe('The "nsfw" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: '[GETS YOU FIRED: Ash fights Gary]',
    textForDefaultSettings: '[NSFW: Ash fights Gary]',
    configChanges: {
      i18n: {
        terms: { nsfw: 'GETS YOU FIRED' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { nsfw: 'look away' }
      }
    }
  })
})


describe('The "nsfl" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: '[RUINS LIFE: Ash fights Gary]',
    textForDefaultSettings: '[NSFL: Ash fights Gary]',
    configChanges: {
      i18n: {
        terms: { nsfl: 'RUINS LIFE' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { nsfl: 'look away' }
      }
    }
  })
})


describe('The "table" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    textForDefaultSettings: `
Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    configChanges: {
      i18n: {
        terms: { table: 'data' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { table: 'info' }
      }
    }
  })
})


describe('The "chart" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    textForConfigChanges: `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    textForDefaultSettings: `
Chart:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    configChanges: {
      i18n: {
        terms: { chart: 'data' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { chart: 'info' }
      }
    }
  })
})


context('Config settings are totally independent. When one setting is changed, the others remain as their defaults. This holds true when using', () => {
  specify('an Up object you create', () => {
    const up = new Up({
      i18n: {
        terms: { footnote: 'reference' }
      }
    })

    expect(up.toAst('[SPOILER: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoilerNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })

  specify('the default Up object', () => {
    const ast =
      Up.toAst('[SPOILER: Ash fights Gary]', {
        i18n: {
          terms: { footnote: 'reference' }
        }
      })

    expect(ast).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoilerNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })
})
