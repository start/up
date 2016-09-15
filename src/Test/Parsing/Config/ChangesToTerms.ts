import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { settingsFor } from './Helpers'
import { distinct } from '../../../CollectionHelpers'


// Elsewhere, we verify that these terms work.
//
// Here, we simply make sure they work as advertised no matter how they are supplied.

function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    markupForDefaultSettings: string
    markupForTermVariations: string
    termVariations: Up.UserProvidedSettings.Parsing.Terms
    invalidMarkupForEmptyTerm: string
    invalidMarkupForBlankTerm: string
    equivalentTermVariationsPlusEmptyAndBlankVariations: Up.UserProvidedSettings.Parsing.Terms
    onlyEmptyAndBlankTermVariations: Up.UserProvidedSettings.Parsing.Terms
    zeroTermVariations: Up.UserProvidedSettings.Parsing.Terms
    conflictingTermVariations: Up.UserProvidedSettings.Parsing.Terms
  }
): void {
  const { markupForDefaultSettings, markupForTermVariations, invalidMarkupForEmptyTerm, invalidMarkupForBlankTerm } = args

  // A quick sanity check! Let's make sure the caller didn't accidentlly provide duplicate
  // markup arguments. 
  const distinctMarkupArguments = distinct(
    markupForTermVariations,
    markupForDefaultSettings,
    invalidMarkupForBlankTerm
  )

  expect(distinctMarkupArguments).to.have.lengthOf(3)

  // Okay! We're almost ready to start testing.
  //
  // First, we need to produce actual, usable settings from the provided term variations.
  //
  // We'll start by producing parsing settings, which are accepted by the library's
  // parsing methods.

  const parsingSettingsFor =
    (changes: Up.UserProvidedSettings.Parsing.Terms): Up.UserProvidedSettings.Parsing => ({
      terms: changes
    })

  const changedParsingSettings =
    parsingSettingsFor(args.termVariations)

  const equivalentParsingSettingsWithEmptyAndBlankVariations =
    parsingSettingsFor(args.equivalentTermVariationsPlusEmptyAndBlankVariations)

  const equivalentParsingSettingsWithOnlyEmptyAndBlankVariations =
    parsingSettingsFor(args.onlyEmptyAndBlankTermVariations)

  const parsingSettingsWithZeroVariations =
    parsingSettingsFor(args.zeroTermVariations)

  const conflictingParsingSettings =
    parsingSettingsFor(args.conflictingTermVariations)

  // Next, we'll produce "overall" settings (which cover both parsing and rendering
  // settings). Up's constructor accepts these settings. 

  const changedSettings =
    settingsFor(changedParsingSettings)

  const equivalentSettingsWithEmptyAndBlankVariations =
    settingsFor(equivalentParsingSettingsWithEmptyAndBlankVariations)

  const equivalentSettingsWithOnlyEmptyAndBlankVariations =
    settingsFor(equivalentParsingSettingsWithOnlyEmptyAndBlankVariations)

  const settingWithZeroVariations =
    settingsFor(parsingSettingsWithZeroVariations)

  const conflictingSettings =
    settingsFor(conflictingParsingSettings)

  // Phew! Almost done. Let's just save off the result of parsing the convention propertly
  // before we apply any settings.

  const properlyParsedConvention =
    Up.parse(markupForDefaultSettings)

  function expectConventiontoProperlyParse(document: Up.Document): void {
    expect(document).to.deep.equal(properlyParsedConvention)
  }

  function expectConventionFailToParse(document: Up.Document): void {
    expect(document).to.not.deep.equal(properlyParsedConvention)
  }


  describe("when provided to the default parse method", () => {
    it("does not alter settings for subsequent calls to the default method", () => {
      expect(Up.parse(markupForTermVariations, changedParsingSettings)).to.deep.equal(Up.parse(markupForDefaultSettings))
    })

    it("does not replace the default variations", () => {
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, changedParsingSettings))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, conflictingParsingSettings))
    })

    it("has any empty or blank variations ignored", () => {
      // First, let's make sure the empty or blank variations are not supported
      expectConventionFailToParse(Up.parse(invalidMarkupForEmptyTerm, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventionFailToParse(Up.parse(invalidMarkupForBlankTerm, equivalentParsingSettingsWithEmptyAndBlankVariations))

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expectConventiontoProperlyParse(Up.parse(markupForTermVariations, equivalentParsingSettingsWithEmptyAndBlankVariations))
    })

    it("has no effect if all variations are empty or blank", () => {
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
    })

    it("has no effect if there are no variations", () => {
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
    })
  })


  describe("when provided to a Transformer object's parse method", () => {
    const up = new Up.Transformer()

    it("does not alter the Up object's original settings", () => {
      expectConventiontoProperlyParse(up.parse(markupForTermVariations, changedParsingSettings))
    })

    it("does not replace the default variations", () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, changedParsingSettings))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, conflictingParsingSettings))
    })

    it("has any blank variations ignored", () => {
      // First, let's make sure the empty or blank variations are not supported
      expectConventionFailToParse(up.parse(invalidMarkupForEmptyTerm, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventionFailToParse(up.parse(invalidMarkupForBlankTerm, equivalentParsingSettingsWithEmptyAndBlankVariations))

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expectConventiontoProperlyParse(up.parse(markupForTermVariations, equivalentParsingSettingsWithEmptyAndBlankVariations))
    })

    it("has no effect if all variations are empty or blank", () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
    })

    it("has no effect if there are no variations", () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
    })
  })


  describe('when provided to a Transformer object at creation', () => {
    const up = new Up.Transformer(changedSettings)

    const whenProvidingChangesAtCreation =
      up.parse(markupForTermVariations)

    it('has the same result as providing the term when calling the default parse method', () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(Up.parse(markupForTermVariations, changedParsingSettings))
    })

    it("has the same result as providing the term when calling the Up object's parse method", () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(new Up.Transformer().parse(markupForTermVariations, changedParsingSettings))
    })

    it("has the same result as providing the term when calling the Up object's parse method, overwriting the term provided at creation", () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(new Up.Transformer(conflictingSettings).parse(markupForTermVariations, changedParsingSettings))
    })

    it("does not replace the default variations", () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings))

      expectConventiontoProperlyParse(new Up.Transformer(equivalentSettingsWithEmptyAndBlankVariations).parse(markupForDefaultSettings))
      expectConventiontoProperlyParse(new Up.Transformer(equivalentSettingsWithOnlyEmptyAndBlankVariations).parse(markupForDefaultSettings))
      expectConventiontoProperlyParse(new Up.Transformer(settingWithZeroVariations).parse(markupForDefaultSettings))
      expectConventiontoProperlyParse(new Up.Transformer(conflictingSettings).parse(markupForDefaultSettings))
    })

    it("can be overwritten by providing different custom terms to the parse method", () => {
      expectConventionFailToParse(up.parse(markupForTermVariations, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
      expectConventionFailToParse(up.parse(markupForTermVariations, parsingSettingsWithZeroVariations))
      expectConventionFailToParse(up.parse(markupForTermVariations, conflictingParsingSettings))
    })

    it("has any blank variations ignored", () => {
      // First, let's make sure the empty or blank variations are not supported
      expectConventionFailToParse(new Up.Transformer(equivalentSettingsWithOnlyEmptyAndBlankVariations).parse(invalidMarkupForEmptyTerm))
      expectConventionFailToParse(new Up.Transformer(equivalentSettingsWithOnlyEmptyAndBlankVariations).parse(invalidMarkupForBlankTerm))

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expectConventiontoProperlyParse(new Up.Transformer(equivalentSettingsWithEmptyAndBlankVariations).parse(markupForTermVariations))
    })

    it("has no effect if all variations are empty or blank", () => {
      const up = new Up.Transformer(equivalentSettingsWithOnlyEmptyAndBlankVariations)

      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings))
    })

    it("has no effect if there are no variations", () => {
      const up = new Up.Transformer(settingWithZeroVariations)

      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings))
    })
  })
}


describe('The "audio" term', () => {
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
    zeroTermVariations: {
      audio: []
    },
    conflictingTermVariations: {
      audio: 'sound'
    }
  })
})


describe('The "image" term', () => {
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
    zeroTermVariations: {
      image: []
    },
    conflictingTermVariations: {
      image: 'picture'
    }
  })
})


describe('The "video" term', () => {
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
    zeroTermVariations: {
      video: []
    },
    conflictingTermVariations: {
      video: 'observe'
    }
  })
})


describe('The "highlight" term', () => {
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
    zeroTermVariations: {
      highlight: []
    },
    conflictingTermVariations: {
      highlight: 'note'
    }
  })
})


describe('The "spoiler" term', () => {
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
    zeroTermVariations: {
      spoiler: []
    },
    conflictingTermVariations: {
      spoiler: 'look away'
    }
  })
})


describe('The "nsfw" term', () => {
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
    zeroTermVariations: {
      nsfw: []
    },
    conflictingTermVariations: {
      nsfw: 'look away'
    }
  })
})


describe('The "nsfl" term', () => {
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
    zeroTermVariations: {
      nsfl: []
    },
    conflictingTermVariations: {
      nsfl: 'look away'
    }
  })
})


describe('The "table" term', () => {
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
    zeroTermVariations: {
      table: []
    },
    conflictingTermVariations: {
      table: 'info'
    }
  })
})


describe('The "chart" term', () => {
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
    zeroTermVariations: {
      chart: []
    },
    conflictingTermVariations: {
      chart: 'info'
    }
  })
})


describe('The "sectionLink" term', () => {
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
      sectionLink: 'heading'
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
      sectionLink: [null, 'heading', '', ' \t \t ', undefined]
    },
    onlyEmptyAndBlankTermVariations: {
      sectionLink: [null, '', ' \t \t ', undefined]
    },
    zeroTermVariations: {
      sectionLink: []
    },
    conflictingTermVariations: {
      sectionLink: 'reference'
    }
  })
})


context('Settings settings are totally independent. When one setting is changed, the others remain as their defaults. This holds true when using', () => {
  specify('a Transformer object you create', () => {
    const up = new Up.Transformer({
      parsing: {
        terms: {
          nsfw: 'ruins ending'
        }
      }
    })

    expect(up.parse('[SPOILER: Ash fights Gary]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('Ash fights Gary')
        ])
      ]))
  })

  specify('the default Up object', () => {
    const document =
      Up.parse('[SPOILER: Ash fights Gary]', {
        terms: {
          nsfw: 'ruins ending'
        }
      })

    expect(document).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('Ash fights Gary')
        ])
      ]))
  })
})
