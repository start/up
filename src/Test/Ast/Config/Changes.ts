import { expect } from 'chai'
import Up from '../../../index'
import { UpConfigSettings } from '../../../UpConfigSettings'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    text: string,
    textForDefaultSettings: string
    configChanges: UpConfigSettings,
    conflictingConfigChanges: UpConfigSettings
  }
): void {
  const { text, textForDefaultSettings, configChanges, conflictingConfigChanges } = args

  describe("when provided to the default (static) toAst method", () => {
    it("does not alter subsequent calls to the default method", () => {
      expect(Up.toAst(text, configChanges)).to.be.eql(Up.toAst(textForDefaultSettings))
    })
  })

  const whenProvidingConfigAtCreation =
    new Up(configChanges).toAst(text)

  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.toAst(text, configChanges)

  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().toAst(text, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).toAst(text, configChanges)

  describe("when provided to an Up object's toAst method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up(configChanges)

      const resultOfConflictingChanges = up.toAst(text, conflictingConfigChanges)

      // Let's make sure the conflicting changes actually were conflicting
      expect(whenProvidingConfigAtCreation).to.not.be.eql(resultOfConflictingChanges)

      // And now let's make sure those conflicting changes didn't overwrite the original settings!
      expect(whenProvidingConfigAtCreation).to.be.eql(up.toAst(text, configChanges))
    })
  })

  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the term when calling the (default) static toAst method', () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
    })

    it("has the same result as providing the term when calling the Up object's toAst method", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingtMethodOnObject)
    })

    it("has the same result as providing the term when calling the Up object's toAst method, overwriting the term provided at creation", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenOverwritingChangesProvidedAtCreation)
    })
  })
}


describe('The "audio" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    text: '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]',
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
    text: '[see: Chrono Cross logo][https://example.com/cc.png]',
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
    text: '[watch: Nevada caucus footage][https://example.com/video.webm]',
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


describe('The "spoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    text: '[RUINS ENDING: Ash fights Gary]',
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
    text: '[GETS YOU FIRED: Ash fights Gary]',
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
    text: '[RUINS LIFE: Ash fights Gary]',
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
    text: `
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

  specify('the default (static) Up object ', () => {
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
