import { expect } from 'chai'
import { distinct } from '../../../Implementation/CollectionHelpers'
import * as Up from '../../../Main'
import { cast } from '../../Helpers'
import { settingsFor } from './Helpers'


// Elsewhere, we verify that these keywords work.
//
// Here, we simply make sure they work as advertised no matter how they are supplied.

function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    markupForDefaultSettings: string
    markupForKeywordVariations: string
    keywordVariations: Up.Settings.Parsing.Keywords
    invalidMarkupForEmptyKeyword: string
    invalidMarkupForBlankKeyword: string
    equivalentKeywordVariationsPlusEmptyAndBlankVariations: Up.Settings.Parsing.Keywords
    onlyEmptyAndBlankKeywordVariations: Up.Settings.Parsing.Keywords
    zeroKeywordVariations: Up.Settings.Parsing.Keywords
    conflictingKeywordVariations: Up.Settings.Parsing.Keywords
  }
): void {
  const { markupForDefaultSettings, markupForKeywordVariations, invalidMarkupForEmptyKeyword, invalidMarkupForBlankKeyword } = args

  // A quick sanity check! Let's make sure the caller didn't accidentlly provide duplicate
  // markup arguments.
  const distinctMarkupArguments = distinct(
    markupForKeywordVariations,
    markupForDefaultSettings,
    invalidMarkupForBlankKeyword
  )

  expect(distinctMarkupArguments).to.have.lengthOf(3)

  // Okay! We're almost ready to start testing.
  //
  // First, we need to produce actual, usable settings from the provided keyword variations.
  //
  // We'll start by producing parsing settings, which are accepted by the library's
  // parsing methods.

  const parsingSettingsFor =
    (changes: Up.Settings.Parsing.Keywords): Up.Settings.Parsing => ({
      keywords: changes
    })

  const changedParsingSettings =
    parsingSettingsFor(args.keywordVariations)

  const equivalentParsingSettingsWithEmptyAndBlankVariations =
    parsingSettingsFor(args.equivalentKeywordVariationsPlusEmptyAndBlankVariations)

  const equivalentParsingSettingsWithOnlyEmptyAndBlankVariations =
    parsingSettingsFor(args.onlyEmptyAndBlankKeywordVariations)

  const parsingSettingsWithZeroVariations =
    parsingSettingsFor(args.zeroKeywordVariations)

  const conflictingParsingSettings =
    parsingSettingsFor(args.conflictingKeywordVariations)

  // Next, we'll produce "overall" settings (which cover both parsing and rendering
  // settings). The `Up` class's constructor accepts these settings.

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


  describe('when provided to the default parse function', () => {
    it('does not alter settings for subsequent calls to the default method', () => {
      expect(Up.parse(markupForKeywordVariations, changedParsingSettings)).to.deep.equal(Up.parse(markupForDefaultSettings))
    })

    it('does not replace the default variations', () => {
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, changedParsingSettings))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, conflictingParsingSettings))
    })

    it('has any empty or blank variations ignored', () => {
      // First, let's make sure the empty or blank variations are not supported
      expectConventionFailToParse(Up.parse(invalidMarkupForEmptyKeyword, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventionFailToParse(Up.parse(invalidMarkupForBlankKeyword, equivalentParsingSettingsWithEmptyAndBlankVariations))

      // Now, let's make sure empty or blank variations don't interfere with valid variations
      expectConventiontoProperlyParse(Up.parse(markupForKeywordVariations, equivalentParsingSettingsWithEmptyAndBlankVariations))
    })

    it('has no effect if all variations are empty or blank', () => {
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
    })

    it('has no effect if there are no variations', () => {
      expectConventiontoProperlyParse(Up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
    })
  })


  describe("when provided to an Up object's parse method", () => {
    const up = new Up.Up()

    it("does not alter the Up object's original settings", () => {
      expectConventiontoProperlyParse(up.parse(markupForKeywordVariations, changedParsingSettings))
    })

    it('does not replace the default variations', () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, changedParsingSettings))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, conflictingParsingSettings))
    })

    it('has any blank variations ignored', () => {
      // First, let's make sure the empty or blank variations are not supported
      expectConventionFailToParse(up.parse(invalidMarkupForEmptyKeyword, equivalentParsingSettingsWithEmptyAndBlankVariations))
      expectConventionFailToParse(up.parse(invalidMarkupForBlankKeyword, equivalentParsingSettingsWithEmptyAndBlankVariations))

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expectConventiontoProperlyParse(up.parse(markupForKeywordVariations, equivalentParsingSettingsWithEmptyAndBlankVariations))
    })

    it('has no effect if all variations are empty or blank', () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
    })

    it('has no effect if there are no variations', () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings, parsingSettingsWithZeroVariations))
    })
  })


  describe('when provided to an Up object at creation', () => {
    const up = new Up.Up(changedSettings)

    const whenProvidingChangesAtCreation =
      up.parse(markupForKeywordVariations)

    it('has the same result as providing the keyword when calling the default parse function', () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(Up.parse(markupForKeywordVariations, changedParsingSettings))
    })

    it("has the same result as providing the keyword when calling the Up object's parse method", () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(new Up.Up().parse(markupForKeywordVariations, changedParsingSettings))
    })

    it("has the same result as providing the keyword when calling the Up object's parse method, overwriting the keyword provided at creation", () => {
      expect(whenProvidingChangesAtCreation).to.deep.equal(new Up.Up(conflictingSettings).parse(markupForKeywordVariations, changedParsingSettings))
    })

    it('does not replace the default variations', () => {
      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings))

      expectConventiontoProperlyParse(new Up.Up(equivalentSettingsWithEmptyAndBlankVariations).parse(markupForDefaultSettings))
      expectConventiontoProperlyParse(new Up.Up(equivalentSettingsWithOnlyEmptyAndBlankVariations).parse(markupForDefaultSettings))
      expectConventiontoProperlyParse(new Up.Up(settingWithZeroVariations).parse(markupForDefaultSettings))
      expectConventiontoProperlyParse(new Up.Up(conflictingSettings).parse(markupForDefaultSettings))
    })

    it('can be overwritten by providing different custom keywords to the parse method', () => {
      expectConventionFailToParse(up.parse(markupForKeywordVariations, equivalentParsingSettingsWithOnlyEmptyAndBlankVariations))
      expectConventionFailToParse(up.parse(markupForKeywordVariations, parsingSettingsWithZeroVariations))
      expectConventionFailToParse(up.parse(markupForKeywordVariations, conflictingParsingSettings))
    })

    it('has any blank variations ignored', () => {
      // First, let's make sure the empty or blank variations are not supported
      expectConventionFailToParse(new Up.Up(equivalentSettingsWithOnlyEmptyAndBlankVariations).parse(invalidMarkupForEmptyKeyword))
      expectConventionFailToParse(new Up.Up(equivalentSettingsWithOnlyEmptyAndBlankVariations).parse(invalidMarkupForBlankKeyword))

      // Now, let's'make sure empty or blank variations don't interfere with valid variations
      expectConventiontoProperlyParse(new Up.Up(equivalentSettingsWithEmptyAndBlankVariations).parse(markupForKeywordVariations))
    })

    it('has no effect if all variations are empty or blank', () => {
      const up = new Up.Up(equivalentSettingsWithOnlyEmptyAndBlankVariations)

      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings))
    })

    it('has no effect if there are no variations', () => {
      const up = new Up.Up(settingWithZeroVariations)

      expectConventiontoProperlyParse(up.parse(markupForDefaultSettings))
    })
  })
}


const NULL_KEYWORD = cast<string>(null)
const UNDEFINED_KEYWORD = cast<string>(undefined)

describe('The "audio" keyword', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForDefaultSettings: '[audio: chanting at Nevada caucus][https://example.com/audio.ogg]',
    markupForKeywordVariations: '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]',
    keywordVariations: {
      audio: 'listen'
    },
    invalidMarkupForEmptyKeyword: '[: chanting at Nevada caucus][https://example.com/audio.ogg]',
    invalidMarkupForBlankKeyword: '[ \t \t : chanting at Nevada caucus][https://example.com/audio.ogg]',
    equivalentKeywordVariationsPlusEmptyAndBlankVariations: {
      audio: [NULL_KEYWORD, 'listen', '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    onlyEmptyAndBlankKeywordVariations: {
      audio: [NULL_KEYWORD, '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    zeroKeywordVariations: {
      audio: []
    },
    conflictingKeywordVariations: {
      audio: 'sound'
    }
  })
})


describe('The "image" keyword', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForKeywordVariations: '[see: Chrono Cross logo][https://example.com/cc.png]',
    markupForDefaultSettings: '[image: Chrono Cross logo][https://example.com/cc.png]',
    keywordVariations: {
      image: 'see'
    },
    invalidMarkupForEmptyKeyword: '[: Chrono Cross logo][https://example.com/cc.png]',
    invalidMarkupForBlankKeyword: '[ \t \t : Chrono Cross logo][https://example.com/cc.png]',
    equivalentKeywordVariationsPlusEmptyAndBlankVariations: {
      image: [NULL_KEYWORD, 'see', '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    onlyEmptyAndBlankKeywordVariations: {
      image: [NULL_KEYWORD, '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    zeroKeywordVariations: {
      image: []
    },
    conflictingKeywordVariations: {
      image: 'picture'
    }
  })
})


describe('The "video" keyword', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForKeywordVariations: '[watch: Nevada caucus footage][https://example.com/video.webm]',
    markupForDefaultSettings: '[video: Nevada caucus footage][https://example.com/video.webm]',
    keywordVariations: {
      video: 'watch'
    },
    invalidMarkupForEmptyKeyword: '[: Nevada caucus footage][https://example.com/video.webm]',
    invalidMarkupForBlankKeyword: '[ \t \t : Nevada caucus footage][https://example.com/video.webm]',
    equivalentKeywordVariationsPlusEmptyAndBlankVariations: {
      video: [NULL_KEYWORD, 'watch', '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    onlyEmptyAndBlankKeywordVariations: {
      video: [NULL_KEYWORD, '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    zeroKeywordVariations: {
      video: []
    },
    conflictingKeywordVariations: {
      video: 'observe'
    }
  })
})


describe('The "revealable" keyword', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForKeywordVariations: '[RUINS ENDING: Ash fights Gary]',
    markupForDefaultSettings: '[SPOILER: Ash fights Gary]',
    keywordVariations: {
      revealable: 'ruins ending'
    },
    invalidMarkupForEmptyKeyword: '[: Ash fights Gary]',
    invalidMarkupForBlankKeyword: '[ \t \t : Ash fights Gary]',
    equivalentKeywordVariationsPlusEmptyAndBlankVariations: {
      revealable: [NULL_KEYWORD, 'ruins ending', '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    onlyEmptyAndBlankKeywordVariations: {
      revealable: [NULL_KEYWORD, '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    zeroKeywordVariations: {
      revealable: []
    },
    conflictingKeywordVariations: {
      revealable: 'look away'
    }
  })
})


describe('The "table" keyword', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForKeywordVariations: `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    markupForDefaultSettings: `
Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    keywordVariations: {
      table: 'data'
    },

    invalidMarkupForEmptyKeyword: `
:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    invalidMarkupForBlankKeyword: `
 \t \t :

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`,

    equivalentKeywordVariationsPlusEmptyAndBlankVariations: {
      table: [NULL_KEYWORD, 'data', '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    onlyEmptyAndBlankKeywordVariations: {
      table: [NULL_KEYWORD, '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    zeroKeywordVariations: {
      table: []
    },
    conflictingKeywordVariations: {
      table: 'info'
    }
  })
})


describe('The "sectionLink" keyword', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markupForKeywordVariations: `
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

    keywordVariations: {
      sectionLink: 'heading'
    },

    invalidMarkupForEmptyKeyword: `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [: exotic].`,

    invalidMarkupForBlankKeyword: `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [ \t \t : exotic].`,

    equivalentKeywordVariationsPlusEmptyAndBlankVariations: {
      sectionLink: [NULL_KEYWORD, 'heading', '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    onlyEmptyAndBlankKeywordVariations: {
      sectionLink: [NULL_KEYWORD, '', ' \t \t ', UNDEFINED_KEYWORD]
    },
    zeroKeywordVariations: {
      sectionLink: []
    },
    conflictingKeywordVariations: {
      sectionLink: 'reference'
    }
  })
})
