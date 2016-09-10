import { expect } from 'chai'
import Up from '../../../index'
import { UserProvidedSettings } from '../../../UserProvidedSettings'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    document: UpDocument
    changedRenderingSetting: UserProvidedSettings.Rendering
    conflictingRenderingSetting: UserProvidedSettings.Rendering
  }
): void {
  const { document, changedRenderingSetting, conflictingRenderingSetting } = args

  const settingsFor =
    (changes: UserProvidedSettings.Rendering): UserProvidedSettings => ({
      rendering: changes
    })

  const changedSettings = settingsFor(changedRenderingSetting)
  const conflictingChangedSettings = settingsFor(conflictingRenderingSetting)

  const htmlFromDefaultSettings =
    Up.renderDocumentAndTableOfContents(document)


  describe("when provided to the default renderDocumentAndTableOfContents method", () => {
    it("does not alter subsequent calls to the default method", () => {
      // Let's make sure the changed settings would actually change the HTML
      expect(Up.renderDocumentAndTableOfContents(document, changedRenderingSetting)).to.not.equal(htmlFromDefaultSettings)

      // Now, let's make sure the changed settings don't alter subsequent calls
      expect(Up.renderDocumentAndTableOfContents(document)).to.deep.equal(htmlFromDefaultSettings)
    })
  })


  const whenProvidingConfigAtCreation =
    new Up(changedSettings).renderDocumentAndTableOfContents(document)


  describe("when provided to an Up object's renderDocumentAndTableOfContents method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up(changedSettings)

      // Let's make sure the provided conflicting changes are actually conflicting
      expect(up.renderDocumentAndTableOfContents(document, changedRenderingSetting)).to.not.equal(whenProvidingConfigAtCreation)

      // Now, let's make sure they didn't alter any subsequent calls
      expect(up.renderDocumentAndTableOfContents(document, changedRenderingSetting)).to.deep.equal(whenProvidingConfigAtCreation)
    })
  })


  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.renderDocumentAndTableOfContents(document, changedRenderingSetting)

  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().renderDocumentAndTableOfContents(document, changedRenderingSetting)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingChangedSettings).renderDocumentAndTableOfContents(document, changedRenderingSetting)


  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the setting when calling the default renderDocumentAndTableOfContents method', () => {
      expect(whenProvidingConfigAtCreation).to.deep.equal(whenProvidingChangesWhenCallingDefaultMethod)
    })

    it("has the same result as providing the setting when calling the Up object's renderDocumentAndTableOfContents method", () => {
      expect(whenProvidingConfigAtCreation).to.deep.equal(whenProvidingChangesWhenCallingtMethodOnObject)
    })

    it("has the same result as providing the setting when calling the Up object's renderDocumentAndTableOfContents method, overwriting the setting provided at creation", () => {
      expect(whenProvidingConfigAtCreation).to.deep.equal(whenOverwritingChangesProvidedAtCreation)
    })
  })
}


describe('The "idPrefix" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ]),
    changedRenderingSetting: {
      idPrefix: 'reply 11'
    },
    conflictingRenderingSetting: {
      idPrefix: 'op'
    }
  })
})


describe('The "footnote reference" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ]),
    changedRenderingSetting: {
      terms: {
        footnoteReference: 'ref'
      }
    },
    conflictingRenderingSetting: {
      terms: {
        footnoteReference: 'fn ref'
      }
    }
  })
})


describe('The "footnote" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ]),
    changedRenderingSetting: {
      terms: {
        footnote: 'fn'
      }
    },
    conflictingRenderingSetting: {
      terms: {
        footnote: 'note'
      }
    }
  })
})


describe('The "sectionReferencedByTableOfContents" config setting', () => {
  const heading = new Heading([], { level: 1 })

  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument(
      [heading],
      new UpDocument.TableOfContents([heading])),
    changedRenderingSetting: {
      terms: {
        sectionReferencedByTableOfContents: 'heading'
      }
    },
    conflictingRenderingSetting: {
      terms: {
        sectionReferencedByTableOfContents: 'item'
      }
    }
  })
})


describe('The "toggleSpoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
      ])
    ]),
    changedRenderingSetting: {
      terms: {
        toggleSpoiler: 'show/hide'
      }
    },
    conflictingRenderingSetting: {
      terms: {
        toggleSpoiler: 'see spoiler?'
      }
    }
  })
})


describe('The "toggleNsfw" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new InlineNsfw([])
      ])
    ]),
    changedRenderingSetting: {
      terms: {
        toggleNsfw: 'see/hide'
      }
    },
    conflictingRenderingSetting: {
      terms: {
        toggleNsfw: 'show nsfw?'
      }
    }
  })
})


describe('The "toggleNsfl" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new InlineNsfl([])
      ])
    ]),
    changedRenderingSetting: {
      terms: {
        toggleNsfl: 'see/hide'
      }
    },
    conflictingRenderingSetting: {
      terms: {
        toggleNsfl: 'show nsfl?'
      }
    }
  })
})


describe('The "tableOfContents" config setting', () => {
  const heading = new Heading([], { level: 1 })

  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument(
      [heading],
      new UpDocument.TableOfContents([heading])),
    changedRenderingSetting: {
      terms: {
        tableOfContents: 'In This Article'
      }
    },
    conflictingRenderingSetting: {
      terms: {
        tableOfContents: 'Skip To…'
      }
    }
  })
})


describe('The "renderUnsafeContent" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new Link([], 'javascript:malicious')
      ])
    ]),
    changedRenderingSetting: {
      renderUnsafeContent: true
    },
    conflictingRenderingSetting: {
      renderUnsafeContent: false
    }
  })
})
