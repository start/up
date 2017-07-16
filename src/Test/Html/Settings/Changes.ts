import { expect } from 'chai'
import * as Up from '../../../Main'
import { cast } from '../../Helpers'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    document: Up.Document
    change: Up.Settings.Rendering
    conflictingChange: Up.Settings.Rendering
  }
): void {
  const { document, change, conflictingChange } = args

  const settingsFor =
    (changes: Up.Settings.Rendering): Up.Settings => ({
      rendering: changes
    })

  const changedSettings = settingsFor(change)
  const conflictingChangedSettings = settingsFor(conflictingChange)

  const htmlFromDefaultSettings =
    Up.renderWithTableOfContents(document)


  describe("when provided to the default renderWithTableOfContents function", () => {
    it("does not alter subsequent calls to the default method", () => {
      // Let's make sure the changed settings would actually change the HTML
      expect(Up.renderWithTableOfContents(document, change)).to.not.equal(htmlFromDefaultSettings)

      // Now, let's make sure the changed settings don't alter subsequent calls
      expect(Up.renderWithTableOfContents(document)).to.deep.equal(htmlFromDefaultSettings)
    })
  })


  const whenProvidingSettingsAtCreation =
    new Up.Up(changedSettings).renderWithTableOfContents(document)


  describe("when provided to an Up object's renderWithTableOfContents method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up.Up(changedSettings)

      // Let's make sure the provided conflicting changes are actually conflicting
      expect(up.renderWithTableOfContents(document, change)).to.not.equal(whenProvidingSettingsAtCreation)

      // Now, let's make sure they didn't alter any subsequent calls
      expect(up.renderWithTableOfContents(document, change)).to.deep.equal(whenProvidingSettingsAtCreation)
    })
  })


  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.renderWithTableOfContents(document, change)

  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up.Up().renderWithTableOfContents(document, change)

  const whenOverwritingChangesProvidedAtCreation =
    new Up.Up(conflictingChangedSettings).renderWithTableOfContents(document, change)


  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the setting when calling the default renderWithTableOfContents function', () => {
      expect(whenProvidingSettingsAtCreation).to.deep.equal(whenProvidingChangesWhenCallingDefaultMethod)
    })

    it("has the same result as providing the setting when calling the Up object's renderWithTableOfContents method", () => {
      expect(whenProvidingSettingsAtCreation).to.deep.equal(whenProvidingChangesWhenCallingtMethodOnObject)
    })

    it("has the same result as providing the setting when calling the Up object's renderWithTableOfContents method, overwriting the setting provided at creation", () => {
      expect(whenProvidingSettingsAtCreation).to.deep.equal(whenOverwritingChangesProvidedAtCreation)
    })
  })
}


describe('The "idPrefix" setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ]),
    change: {
      idPrefix: 'reply 11'
    },
    conflictingChange: {
      idPrefix: 'op'
    }
  })
})


describe('The "footnote reference" term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ]),
    change: {
      terms: {
        footnoteReference: 'ref'
      }
    },
    conflictingChange: {
      terms: {
        footnoteReference: 'fn ref'
      }
    }
  })
})


describe('The "footnote" term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ]),
    change: {
      terms: {
        footnote: 'fn'
      }
    },
    conflictingChange: {
      terms: {
        footnote: 'note'
      }
    }
  })
})


describe('The "sectionReferencedByTableOfContents" setting', () => {
  const NOT_USED = cast<string>(null)

  const heading = new Up.Heading([], { level: 1, titleMarkup: NOT_USED })

  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new Up.Document(
      [heading],
      new Up.Document.TableOfContents([heading])),
    change: {
      terms: {
        sectionReferencedByTableOfContents: 'heading'
      }
    },
    conflictingChange: {
      terms: {
        sectionReferencedByTableOfContents: 'item'
      }
    }
  })
})


describe('The "hide" term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ]),
    change: {
      terms: {
        hide: 'collapse'
      }
    },
    conflictingChange: {
      terms: {
        hide: 'minimize'
      }
    }
  })
})


describe('The "reveal" term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ]),
    change: {
      terms: {
        reveal: 'expand'
      }
    },
    conflictingChange: {
      terms: {
        reveal: 'show'
      }
    }
  })
})


describe('The "renderDangerousContent" setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new Up.Document([
      new Up.Paragraph([
        new Up.Link([], 'javascript:malicious')
      ])
    ]),
    change: {
      renderDangerousContent: true
    },
    conflictingChange: {
      renderDangerousContent: false
    }
  })
})
