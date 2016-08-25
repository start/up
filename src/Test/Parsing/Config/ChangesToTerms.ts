import { expect } from 'chai'
import Up from '../../../index'
import { UserProvidedSettings } from '../../../UserProvidedSettings'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { distinct } from '../../../CollectionHelpers'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    markupForDefaultSettings: string
    markupForTermVariations: string
    termVariations: UserProvidedSettings.Terms.Markup
    invalidMarkupForEmptyTerm: string
    invalidMarkupForBlankTerm: string
    equivalentTermVariationsPlusEmptyAndBlankVariations: UserProvidedSettings.Terms.Markup
    onlyEmptyAndBlankTermVariations: UserProvidedSettings.Terms.Markup
    noTermVariations: UserProvidedSettings.Terms.Markup
    conflictingTermVariations: UserProvidedSettings.Terms.Markup
  }
): void {
  const { markupForDefaultSettings, markupForTermVariations, invalidMarkupForEmptyTerm, invalidMarkupForBlankTerm } = args

  // A quick sanity check! Let's make sure the caller didn't accidentlly provide duplicate markup arguments. 
  const distinctMarkupArguments = distinct(
    markupForTermVariations,
    markupForDefaultSettings,
    invalidMarkupForBlankTerm
  )

  expect(distinctMarkupArguments).to.have.lengthOf(3)

  // Okay! On with testing.
  //
  // First, let's produce actual, usable config settings from the provided term variations.

  const configChangesFor = (changes: UserProvidedSettings.Terms.Markup) => ({
    terms: { markup: changes }
  })

  const configChanges =
    configChangesFor(args.termVariations)

  const equivalentConfigChangesWithEmptyAndBlankVariations =
    configChangesFor(args.equivalentTermVariationsPlusEmptyAndBlankVariations)

  const configChangesWithOnlyEmptyAndBlankVariations =
    configChangesFor(args.onlyEmptyAndBlankTermVariations)

  const configChangesWithNoVariations =
    configChangesFor(args.noTermVariations)

  const conflictingConfigChanges =
    configChangesFor(args.conflictingTermVariations)

  const whenEverythingIsDefault =
    Up.toDocument(markupForDefaultSettings)


  describe("when provided to the default toDocument method", () => {
    it("does not alter settings for subsequent calls to the default method", () => {
      expect(Up.toDocument(markupForTermVariations, configChanges)).to.deep.equal(Up.toDocument(markupForDefaultSettings))
    })

    it("does not replace the default variations", () => {
      expect(Up.toDocument(markupForDefaultSettings, configChanges)).to.deep.equal(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, equivalentConfigChangesWithEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.deep.equal(whenEverythingIsDefault)
      expect(Up.toDocument(markupForDefaultSettings, conflictingConfigChanges)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has any empty or blank variations ignored", () => {
      // First, let's make sure the empty or blank variations are not supported
      expect(Up.toDocument(invalidMarkupForEmptyTerm, equivalentConfigChangesWithEmptyAndBlankVariations)).to.not.deep.equal(whenEverythingIsDefault)
      expect(Up.toDocument(invalidMarkupForBlankTerm, equivalentConfigChangesWithEmptyAndBlankVariations)).to.not.deep.equal(whenEverythingIsDefault)

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expect(Up.toDocument(markupForTermVariations, equivalentConfigChangesWithEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has no effect if all variations are empty or blank", () => {
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has no effect if there are no variations", () => {
      expect(Up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.deep.equal(whenEverythingIsDefault)
    })
  })


  describe("when provided to an Up object's toDocument method", () => {
    const up = new Up()

    it("does not alter the Up object's original settings", () => {
      expect(up.toDocument(markupForTermVariations, configChanges)).to.deep.equal(whenEverythingIsDefault)
    })

    it("does not replace the default variations", () => {
      expect(up.toDocument(markupForDefaultSettings, configChanges)).to.deep.equal(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, equivalentConfigChangesWithEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.deep.equal(whenEverythingIsDefault)
      expect(up.toDocument(markupForDefaultSettings, conflictingConfigChanges)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has any blank variations ignored", () => {
      // First, let's make sure the empty or blank variations are not supported
      expect(up.toDocument(invalidMarkupForEmptyTerm, equivalentConfigChangesWithEmptyAndBlankVariations)).to.not.deep.equal(whenEverythingIsDefault)
      expect(up.toDocument(invalidMarkupForBlankTerm, equivalentConfigChangesWithEmptyAndBlankVariations)).to.not.deep.equal(whenEverythingIsDefault)

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expect(up.toDocument(markupForTermVariations, equivalentConfigChangesWithEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has no effect if all variations are empty or blank", () => {
      expect(up.toDocument(markupForDefaultSettings, configChangesWithOnlyEmptyAndBlankVariations)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has no effect if there are no variations", () => {
      expect(up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.deep.equal(whenEverythingIsDefault)
    })
  })


  describe('when provided to an Up object at creation', () => {
    const up = new Up(configChanges)

    const whenProvidingChangesAtCreation =
      up.toDocument(markupForTermVariations)

    it('has the same result as providing the term when calling the default toDocument method', () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(Up.toDocument(markupForTermVariations, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toDocument method", () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(new Up().toDocument(markupForTermVariations, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toDocument method, overwriting the term provided at creation", () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(new Up(conflictingConfigChanges).toDocument(markupForTermVariations, configChanges))
    })

    it("does not replace the default variations", () => {
      expect(up.toDocument(markupForDefaultSettings)).to.deep.equal(whenEverythingIsDefault)

      expect(new Up(equivalentConfigChangesWithEmptyAndBlankVariations).toDocument(markupForDefaultSettings)).to.deep.equal(whenEverythingIsDefault)
      expect(new Up(configChangesWithOnlyEmptyAndBlankVariations).toDocument(markupForDefaultSettings)).to.deep.equal(whenEverythingIsDefault)
      expect(new Up(configChangesWithNoVariations).toDocument(markupForDefaultSettings)).to.deep.equal(whenEverythingIsDefault)
      expect(new Up(conflictingConfigChanges).toDocument(markupForDefaultSettings)).to.deep.equal(whenEverythingIsDefault)
    })

    it("can be overwritten by providing different custom terms to the toDocument method", () => {
      expect(up.toDocument(markupForTermVariations, configChangesWithOnlyEmptyAndBlankVariations)).to.not.deep.equal(whenEverythingIsDefault)
      expect(up.toDocument(markupForTermVariations, configChangesWithNoVariations)).to.not.deep.equal(whenEverythingIsDefault)
      expect(up.toDocument(markupForTermVariations, conflictingConfigChanges)).to.not.deep.equal(whenEverythingIsDefault)
    })

    it("has any blank variations ignored", () => {
      // First, let's make sure the empty or blank variations are not supported
      expect(new Up(configChangesWithOnlyEmptyAndBlankVariations).toDocument(invalidMarkupForEmptyTerm)).to.not.deep.equal(whenEverythingIsDefault)
      expect(new Up(configChangesWithOnlyEmptyAndBlankVariations).toDocument(invalidMarkupForBlankTerm)).to.not.deep.equal(whenEverythingIsDefault)

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expect(new Up(equivalentConfigChangesWithEmptyAndBlankVariations).toDocument(markupForTermVariations)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has no effect if all variations are empty or blank", () => {
      const up = new Up(configChangesWithOnlyEmptyAndBlankVariations)

      expect(up.toDocument(markupForDefaultSettings)).to.deep.equal(whenEverythingIsDefault)
    })

    it("has no effect if there are no variations", () => {
      const up = new Up(configChangesWithNoVariations)

      expect(up.toDocument(markupForDefaultSettings, configChangesWithNoVariations)).to.deep.equal(whenEverythingIsDefault)
    })
  })
}


describe('The "audio" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForDefaultSettings: '[audio: chanting at Nevada caucus][https://example.com/audio.ogg]',
    markupForTermVariations: '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]',
    termVariations: {
      audio: 'listen'
    },
    invalidMarkupForEmptyTerm: '[: chanting at Nevada caucus][https://example.com/audio.ogg]',
    invalidMarkupForBlankTerm: '[ \t \t : chanting at Nevada caucus][https://example.com/audio.ogg]',
    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      audio: [null, 'listen', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      audio: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      audio: []
    },
    conflictingTermVariations: {
      audio: 'sound'
    }
  })
})


describe('The "image" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: '[see: Chrono Cross logo][https://example.com/cc.png]',
    markupForDefaultSettings: '[image: Chrono Cross logo][https://example.com/cc.png]',
    termVariations: {
      image: 'see'
    },
    invalidMarkupForEmptyTerm: '[: Chrono Cross logo][https://example.com/cc.png]',
    invalidMarkupForBlankTerm: '[ \t \t : Chrono Cross logo][https://example.com/cc.png]',
    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      image: [null, 'see', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      image: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      image: []
    },
    conflictingTermVariations: {
      image: 'picture'
    }
  })
})


describe('The "video" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: '[watch: Nevada caucus footage][https://example.com/video.webm]',
    markupForDefaultSettings: '[video: Nevada caucus footage][https://example.com/video.webm]',
    termVariations: {
      video: 'watch'
    },
    invalidMarkupForEmptyTerm: '[: Nevada caucus footage][https://example.com/video.webm]',
    invalidMarkupForBlankTerm: '[ \t \t : Nevada caucus footage][https://example.com/video.webm]',
    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      video: [null, 'watch', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      video: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      video: []
    },
    conflictingTermVariations: {
      video: 'observe'
    }
  })
})


describe('The "highlight" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: '[paint: Ash fights Gary]',
    markupForDefaultSettings: '[highlight: Ash fights Gary]',
    termVariations: {
      highlight: 'paint'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      highlight: [null, 'paint', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      highlight: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      highlight: []
    },
    conflictingTermVariations: {
      highlight: 'note'
    }
  })
})


describe('The "spoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: '[RUINS ENDING: Ash fights Gary]',
    markupForDefaultSettings: '[SPOILER: Ash fights Gary]',
    termVariations: {
      spoiler: 'ruins ending'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      spoiler: [null, 'ruins ending', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      spoiler: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      spoiler: []
    },
    conflictingTermVariations: {
      spoiler: 'look away'
    }
  })
})


describe('The "nsfw" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: '[GETS YOU FIRED: Ash fights Gary]',
    markupForDefaultSettings: '[NSFW: Ash fights Gary]',
    termVariations: {
      nsfw: 'GETS YOU FIRED'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      nsfw: [null, 'GETS YOU FIRED', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      nsfw: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      nsfw: []
    },
    conflictingTermVariations: {
      nsfw: 'look away'
    }
  })
})


describe('The "nsfl" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: '[RUINS LIFE: Ash fights Gary]',
    markupForDefaultSettings: '[NSFL: Ash fights Gary]',
    termVariations: {
      nsfl: 'RUINS LIFE'
    },
    invalidMarkupForEmptyTerm: '[: Ash fights Gary]',
    invalidMarkupForBlankTerm: '[ \t \t : Ash fights Gary]',
    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      nsfl: [null, 'RUINS LIFE', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      nsfl: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      nsfl: []
    },
    conflictingTermVariations: {
      nsfl: 'look away'
    }
  })
})


describe('The "table" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    markupForDefaultSettings: `
Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    termVariations: {
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

    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      table: [null, 'data', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      table: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      table: []
    },
    conflictingTermVariations: {
      table: 'info'
    }
  })
})


describe('The "chart" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    markupForDefaultSettings: `
Chart:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    termVariations: {
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

    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      chart: [null, 'data', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      chart: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      chart: []
    },
    conflictingTermVariations: {
      chart: 'info'
    }
  })
})


describe('The "referenceToTableOfContentsEntry" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForTermVariations: `
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

    termVariations: {
      referenceToTableOfContentsEntry: 'heading'
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

    equivalentTermVariationsPlusEmptyAndBlankVariations: {
      referenceToTableOfContentsEntry: [null, 'heading', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      referenceToTableOfContentsEntry: [null, '', ' \t \t ', undefined]
    },
    noTermVariations: {
      referenceToTableOfContentsEntry: []
    },
    conflictingTermVariations: {
      referenceToTableOfContentsEntry: 'reference'
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

    expect(up.toDocument('[SPOILER: Ash fights Gary]')).to.deep.equal(
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

    expect(document).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('Ash fights Gary')
        ])
      ]))
  })
})
