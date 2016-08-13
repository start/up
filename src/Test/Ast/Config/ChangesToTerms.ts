import { expect } from 'chai'
import Up from '../../../index'
import { UserProvidedSettings } from '../../../UserProvidedSettings'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    markupForConfigChanges: string
    markupForDefaultSettings: string
    configChanges: UserProvidedSettings
    equivalentConfigChangesWithBlankVariations: UserProvidedSettings
    conflictingConfigChanges: UserProvidedSettings
  }
): void {
  const { markupForConfigChanges, markupForDefaultSettings, configChanges, equivalentConfigChangesWithBlankVariations, conflictingConfigChanges } = args

  // First, let's make sure the caller is expecting their config changes to make a difference
  expect(markupForConfigChanges).to.not.be.eql(markupForDefaultSettings)

  const whenEverythingIsDefault =
    Up.toAst(markupForDefaultSettings)


  describe("when provided to the default toAst method", () => {
    it("does not alter settings for subsequent calls to the default method", () => {
      expect(Up.toAst(markupForConfigChanges, configChanges)).to.be.eql(Up.toAst(markupForDefaultSettings))
    })

    it("replaces the original setting", () => {
      expect(Up.toAst(markupForDefaultSettings, configChanges)).to.not.be.eql(whenEverythingIsDefault)
    })

    it("has any blank variations ignored", () => {
      expect(Up.toAst(markupForConfigChanges, equivalentConfigChangesWithBlankVariations)).to.be.eql(whenEverythingIsDefault)
    })
  })


  describe("when provided to an Up object's toAst method", () => {
    const up = new Up()

    it("does not alter the Up object's original settings", () => {
      expect(up.toAst(markupForConfigChanges, configChanges)).to.be.eql(whenEverythingIsDefault)
    })

    it("replaces the original setting", () => {
      expect(up.toAst(markupForDefaultSettings, configChanges)).to.not.be.eql(whenEverythingIsDefault)
    })

    it("has any blank variations ignored", () => {
      expect(up.toAst(markupForConfigChanges, equivalentConfigChangesWithBlankVariations)).to.be.eql(whenEverythingIsDefault)
    })
  })


  describe('when provided to an Up object at creation', () => {
    const up = new Up(configChanges)

    const whenProvidingChangesAtCreation =
      up.toAst(markupForConfigChanges)

    it('has the same result as providing the term when calling the default toAst method', () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(Up.toAst(markupForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toAst method", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up().toAst(markupForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toAst method, overwriting the term provided at creation", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up(conflictingConfigChanges).toAst(markupForConfigChanges, configChanges))
    })

    it("replaces the original setting", () => {
      expect(up.toAst(markupForDefaultSettings)).to.not.be.eql(whenEverythingIsDefault)
    })

    it("has any blank variations ignored", () => {
      expect(up.toAst(markupForConfigChanges, equivalentConfigChangesWithBlankVariations)).to.be.eql(whenEverythingIsDefault)
    })
  })
}


describe('The "audio" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]',
    markupForDefaultSettings: '[audio: chanting at Nevada caucus][https://example.com/audio.ogg]',
    configChanges: {
      terms: { audio: 'listen' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { audio: [null, 'listen', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { audio: 'sound' }
    }
  })
})


describe('The "image" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[see: Chrono Cross logo][https://example.com/cc.png]',
    markupForDefaultSettings: '[image: Chrono Cross logo][https://example.com/cc.png]',
    configChanges: {
      terms: { image: 'see' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { image: [null, 'see', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { image: 'picture' }
    }
  })
})


describe('The "video" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[watch: Nevada caucus footage][https://example.com/video.webm]',
    markupForDefaultSettings: '[video: Nevada caucus footage][https://example.com/video.webm]',
    configChanges: {
      terms: { video: 'watch' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { video: [null, 'watch', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { video: 'observe' }
    }
  })
})


describe('The "highlight" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[mark: Ash fights Gary]',
    markupForDefaultSettings: '[highlight: Ash fights Gary]',
    configChanges: {
      terms: { highlight: 'mark' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { highlight: [null, 'mark', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { highlight: 'paint' }
    }
  })
})


describe('The "spoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[RUINS ENDING: Ash fights Gary]',
    markupForDefaultSettings: '[SPOILER: Ash fights Gary]',
    configChanges: {
      terms: { spoiler: 'ruins ending' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { spoiler: [null, 'ruins ending', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { spoiler: 'look away' }
    }
  })
})


describe('The "nsfw" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[GETS YOU FIRED: Ash fights Gary]',
    markupForDefaultSettings: '[NSFW: Ash fights Gary]',
    configChanges: {
      terms: { nsfw: 'GETS YOU FIRED' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { nsfw: [null, 'GETS YOU FIRED', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { nsfw: 'look away' }
    }
  })
})


describe('The "nsfl" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[RUINS LIFE: Ash fights Gary]',
    markupForDefaultSettings: '[NSFL: Ash fights Gary]',
    configChanges: {
      terms: { nsfl: 'RUINS LIFE' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { nsfl: [null, 'RUINS LIFE', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { nsfl: 'look away' }
    }
  })
})


describe('The "table" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    markupForDefaultSettings: `
Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    configChanges: {
      terms: { table: 'data' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { table: [null, 'data', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { table: 'info' }
    }
  })
})


describe('The "chart" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    markupForDefaultSettings: `
Chart:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,
    configChanges: {
      terms: { chart: 'data' }
    },
    equivalentConfigChangesWithBlankVariations: {
      terms: { chart: [null, 'data', '', ' \t \t ', undefined] }
    },
    conflictingConfigChanges: {
      terms: { chart: 'info' }
    }
  })
})


context('Config settings are totally independent. When one setting is changed, the others remain as their defaults. This holds true when using', () => {
  specify('an Up object you create', () => {
    const up = new Up({
      terms: { footnote: 'reference' }
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
        terms: { footnote: 'reference' }
      })

    expect(ast).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoilerNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })
})
