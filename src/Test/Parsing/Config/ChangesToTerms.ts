import { expect } from 'chai'
import Up from '../../../index'
import { UserProvidedSettings } from '../../../UserProvidedSettings'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    markupForDefaultSettings: string
    markupForConfigChanges: string
    termChanges: UserProvidedSettings.Terms.Markup
    invalidMarkupForEmptyTerm: string
    invalidMarkupForBlankTerm: string
    equivalentTermChangesWithEmptyAndBlankVariations: UserProvidedSettings.Terms.Markup
    termChangesWithOnlyEmptyAndBlankVariations: UserProvidedSettings.Terms.Markup
    termChangesWithNoVariations: UserProvidedSettings.Terms.Markup
    conflictingTermChanges: UserProvidedSettings.Terms.Markup
  }
): void {
  const { markupForDefaultSettings, markupForConfigChanges, invalidMarkupForEmptyTerm } = args


  const configChangesFor = (changes: UserProvidedSettings.Terms.Markup) => ({
    terms: { markup: changes }
  })

  const configChanges =
    configChangesFor(args.termChanges)

  const equivalentConfigChangesWithEmptyAndBlankVariations =
    configChangesFor(args.equivalentTermChangesWithEmptyAndBlankVariations)

  const configChangesWithOnlyEmptyAndBlankVariations =
    configChangesFor(args.termChangesWithOnlyEmptyAndBlankVariations)

  const configChangesWithNoVariations =
    configChangesFor(args.termChangesWithNoVariations)

  const conflictingConfigChanges =
    configChangesFor(args.conflictingTermChanges)

  // First, let's make sure the caller is expecting their config changes to make a difference
  expect(markupForConfigChanges).to.not.be.eql(markupForDefaultSettings)

  const whenEverythingIsDefault =
    Up.toDocument(markupForDefaultSettings)


  describe("when provided to the default toDocument method", () => {
    it("does not alter settings for subsequent calls to the default method", () => {
      expect(Up.toDocument(markupForConfigChanges, configChanges)).to.be.eql(Up.toDocument(markupForDefaultSettings))
    })

    it("does not replace the default variations", () => {
      expect(Up.toDocument(markupForDefaultSettings, configChanges)).to.be.eql(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, equivalentConfigChangesWithEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.be.eql(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, conflictingConfigChanges)).to.be.eql(whenEverythingIsDefault)
    })

    it("has any empty or blank variations ignored", () => {
      expect(Up.toDocument(invalidMarkupForEmptyTerm, equivalentConfigChangesWithEmptyAndBlankVariations)).to.not.be.eql(whenEverythingIsDefault)

      expect(Up.toDocument(markupForConfigChanges, equivalentConfigChangesWithEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
    })

    it("has no effect if all variations are empty or blank", () => {
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
    })

    it("has no effect if there are no variations", () => {
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.be.eql(whenEverythingIsDefault)
    })
  })


  describe("when provided to an Up object's toDocument method", () => {
    const up = new Up()

    it("does not alter the Up object's original settings", () => {
      expect(up.toDocument(markupForConfigChanges, configChanges)).to.be.eql(whenEverythingIsDefault)
    })

    it("does not replace the default variations", () => {
      expect(up.toDocument(markupForDefaultSettings, configChanges)).to.be.eql(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, equivalentConfigChangesWithEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.be.eql(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, conflictingConfigChanges)).to.be.eql(whenEverythingIsDefault)
    })

    it("has any blank variations ignored", () => {
      expect(up.toDocument(invalidMarkupForEmptyTerm, equivalentConfigChangesWithEmptyAndBlankVariations)).to.not.be.eql(whenEverythingIsDefault)

      expect(up.toDocument(markupForConfigChanges, equivalentConfigChangesWithEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
    })

    it("has no effect if all variations are empty or blank", () => {
      expect(up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.be.eql(whenEverythingIsDefault)
    })

    it("has no effect if there are no variations", () => {
      expect(up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.be.eql(whenEverythingIsDefault)
    })
  })


  describe('when provided to an Up object at creation', () => {
    const up = new Up(configChanges)

    const whenProvidingChangesAtCreation =
      up.toDocument(markupForConfigChanges)

    it('has the same result as providing the term when calling the default toDocument method', () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(Up.toDocument(markupForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toDocument method", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up().toDocument(markupForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toDocument method, overwriting the term provided at creation", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up(conflictingConfigChanges).toDocument(markupForConfigChanges, configChanges))
    })

    it("does not replace the default variations", () => {
      expect(up.toDocument(markupForDefaultSettings)).to.be.eql(whenEverythingIsDefault)
      
      expect(new Up(equivalentConfigChangesWithEmptyAndBlankVariations).toDocument(markupForDefaultSettings)).to.be.eql(whenEverythingIsDefault)
      expect(new Up(configChangesWithOnlyEmptyAndBlankVariations).toDocument(markupForDefaultSettings)).to.be.eql(whenEverythingIsDefault)
      expect(new Up(configChangesWithNoVariations).toDocument(markupForDefaultSettings)).to.be.eql(whenEverythingIsDefault)
      expect(new Up(conflictingConfigChanges).toDocument(markupForDefaultSettings)).to.be.eql(whenEverythingIsDefault)
    })

    it("has any blank variations ignored", () => {
      const up = new Up(equivalentConfigChangesWithEmptyAndBlankVariations)

      expect(up.toDocument(invalidMarkupForEmptyTerm)).to.not.be.eql(whenEverythingIsDefault)
      expect(up.toDocument(markupForConfigChanges)).to.be.eql(whenEverythingIsDefault)
    })

    it("has no effect if all variations are empty or blank", () => {
      const up = new Up(configChangesWithOnlyEmptyAndBlankVariations)

      expect(up.toDocument(markupForDefaultSettings)).to.be.eql(whenEverythingIsDefault)
    })

    it("has no effect if there are no variations", () => {
      const up = new Up(configChangesWithNoVariations)

      expect(up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.be.eql(whenEverythingIsDefault)
    })
  })
}


describe('The "audio" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForDefaultSettings: '[audio: chanting at Nevada caucus][https://example.com/audio.ogg]',
    markupForConfigChanges: '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]',
    termChanges: {
      audio: 'listen'
    },
    invalidMarkupForEmptyTerm: '[: chanting at Nevada caucus][https://example.com/audio.ogg]',
    invalidMarkupForBlankTerm: '[ \t \t : chanting at Nevada caucus][https://example.com/audio.ogg]',
    equivalentTermChangesWithEmptyAndBlankVariations: {
      audio: [null, 'listen', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      audio: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      audio: []
    },
    conflictingTermChanges: {
      audio: 'sound'
    }
  })
})


describe('The "image" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[see: Chrono Cross logo][https://example.com/cc.png]',
    markupForDefaultSettings: '[image: Chrono Cross logo][https://example.com/cc.png]',
    termChanges: {
      image: 'see'
    },
    invalidMarkupForEmptyTerm: '[: Chrono Cross logo][https://example.com/cc.png]',
    invalidMarkupForBlankTerm: '[ \t \t : Chrono Cross logo][https://example.com/cc.png]',
    equivalentTermChangesWithEmptyAndBlankVariations: {
      image: [null, 'see', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      image: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      image: []
    },
    conflictingTermChanges: {
      image: 'picture'
    }
  })
})


describe('The "video" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[watch: Nevada caucus footage][https://example.com/video.webm]',
    markupForDefaultSettings: '[video: Nevada caucus footage][https://example.com/video.webm]',
    termChanges: {
      video: 'watch'
    },
    invalidMarkupForEmptyTerm: '[: Nevada caucus footage][https://example.com/video.webm]',
    invalidMarkupForBlankTerm: '[ \t \t : Nevada caucus footage][https://example.com/video.webm]',
    equivalentTermChangesWithEmptyAndBlankVariations: {
      video: [null, 'watch', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      video: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      video: []
    },
    conflictingTermChanges: {
      video: 'observe'
    }
  })
})


describe('The "highlight" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[mark: Ash fights Gary]',
    markupForDefaultSettings: '[highlight: Ash fights Gary]',
    termChanges: {
      highlight: 'mark'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermChangesWithEmptyAndBlankVariations: {
      highlight: [null, 'mark', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      highlight: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      highlight: []
    },
    conflictingTermChanges: {
      highlight: 'paint'
    }
  })
})


describe('The "spoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[RUINS ENDING: Ash fights Gary]',
    markupForDefaultSettings: '[SPOILER: Ash fights Gary]',
    termChanges: {
      spoiler: 'ruins ending'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermChangesWithEmptyAndBlankVariations: {
      spoiler: [null, 'ruins ending', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      spoiler: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      spoiler: []
    },
    conflictingTermChanges: {
      spoiler: 'look away'
    }
  })
})


describe('The "nsfw" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[GETS YOU FIRED: Ash fights Gary]',
    markupForDefaultSettings: '[NSFW: Ash fights Gary]',
    termChanges: {
      nsfw: 'GETS YOU FIRED'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermChangesWithEmptyAndBlankVariations: {
      nsfw: [null, 'GETS YOU FIRED', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      nsfw: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      nsfw: []
    },
    conflictingTermChanges: {
      nsfw: 'look away'
    }
  })
})


describe('The "nsfl" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: '[RUINS LIFE: Ash fights Gary]',
    markupForDefaultSettings: '[NSFL: Ash fights Gary]',
    termChanges: {
      nsfl: 'RUINS LIFE'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermChangesWithEmptyAndBlankVariations: {
      nsfl: [null, 'RUINS LIFE', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      nsfl: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      nsfl: []
    },
    conflictingTermChanges: {
      nsfl: 'look away'
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

    termChanges: {
      table: 'data'
    },

    invalidMarkupForEmptyTerm: `
:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    invalidMarkupForBlankTerm: `
 \t \t :

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    equivalentTermChangesWithEmptyAndBlankVariations: {
      table: [null, 'data', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      table: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      table: []
    },
    conflictingTermChanges: {
      table: 'info'
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

    termChanges: {
      chart: 'data'
    },

    invalidMarkupForEmptyTerm: `
:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    invalidMarkupForBlankTerm: `
 \t \t :

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    equivalentTermChangesWithEmptyAndBlankVariations: {
      chart: [null, 'data', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      chart: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      chart: []
    },
    conflictingTermChanges: {
      chart: 'info'
    }
  })
})


describe('The "referencedSection" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForConfigChanges: `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [heading: exotic].`,

    markupForDefaultSettings: `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [section: exotic].`,

    termChanges: {
      referencedSection: 'heading'
    },

    invalidMarkupForEmptyTerm: `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [: exotic].`,

    invalidMarkupForBlankTerm: `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [ \t \t : exotic].`,

    equivalentTermChangesWithEmptyAndBlankVariations: {
      referencedSection: [null, 'heading', '', ' \t \t ', undefined]
    },
    termChangesWithOnlyEmptyAndBlankVariations: {
      referencedSection: [null, '', ' \t \t ', undefined]
    },
    termChangesWithNoVariations: {
      referencedSection: []
    },
    conflictingTermChanges: {
      referencedSection: 'heading'
    }
  })
})


context('Config settings are totally independent. When one setting is changed, the others remain as their defaults. This holds true when using', () => {
  specify('an Up object you create', () => {
    const up = new Up({
      terms: {
        markup: {
          nsfw: 'ruins ending'
        }
      }
    })

    expect(up.toDocument('[SPOILER: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })

  specify('the default Up object', () => {
    const document =
      Up.toDocument('[SPOILER: Ash fights Gary]', {
        terms: {
          markup: {
            nsfw: 'ruins ending'
          }
        }
      })

    expect(document).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })
})
