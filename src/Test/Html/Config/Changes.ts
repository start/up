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
    configChanges: UserProvidedSettings
    conflictingConfigChanges: UserProvidedSettings
  }
): void {
  const { document, configChanges, conflictingConfigChanges } = args

  const htmlFromDefaultSettings =
    Up.renderDocumentAndTableOfContents(document)


  describe("when provided to the default renderDocumentAndTableOfContents method", () => {
    it("does not alter subsequent calls to the default method", () => {
      // Let's make sure the provided config changes would actually change the HTML
      expect(Up.renderDocumentAndTableOfContents(document, configChanges)).to.not.equal(htmlFromDefaultSettings)

      // Now, let's make sure the config changes don't alter subsequent calls
      expect(Up.renderDocumentAndTableOfContents(document)).to.deep.equal(htmlFromDefaultSettings)
    })
  })


  const whenProvidingConfigAtCreation =
    new Up(configChanges).renderDocumentAndTableOfContents(document)


  describe("when provided to an Up object's renderDocumentAndTableOfContents method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up(configChanges)

      // Let's make sure the provided conflicting changes are actually conflicting
      expect(up.renderDocumentAndTableOfContents(document, conflictingConfigChanges)).to.not.equal(whenProvidingConfigAtCreation)

      // Now, let's make sure they didn't alter any subsequent calls
      expect(up.renderDocumentAndTableOfContents(document, configChanges)).to.deep.equal(whenProvidingConfigAtCreation)
    })
  })


  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.renderDocumentAndTableOfContents(document, configChanges)

  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().renderDocumentAndTableOfContents(document, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).renderDocumentAndTableOfContents(document, configChanges)


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
    configChanges: {
      idPrefix: 'reply 11'
    },
    conflictingConfigChanges: {
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
    configChanges: {
      terms: {
        rendered: {
          footnoteReference: 'ref'
        }
      }
    },
    conflictingConfigChanges: {
      terms: {
        rendered: {
          footnoteReference: 'fn ref'
        }
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
    configChanges: {
      terms: {
        rendered: {
          footnote: 'fn'
        }
      }
    },
    conflictingConfigChanges: {
      terms: {
        rendered: {
          footnote: 'note'
        }
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
    configChanges: {
      terms: {
        rendered: {
          sectionReferencedByTableOfContents: 'heading'
        }
      }
    },
    conflictingConfigChanges: {
      terms: {
        rendered: {
          sectionReferencedByTableOfContents: 'item'
        }
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
    configChanges: {
      terms: {
        rendered: {
          toggleSpoiler: 'show/hide'
        }
      }
    },
    conflictingConfigChanges: {
      terms: {
        rendered: {
          toggleSpoiler: 'see spoiler?'
        }
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
    configChanges: {
      terms: {
        rendered: {
          toggleNsfw: 'see/hide'
        }
      }
    },
    conflictingConfigChanges: {
      terms: {
        rendered: {
          toggleNsfw: 'show nsfw?'
        }
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
    configChanges: {
      terms: {
        rendered: {
          toggleNsfl: 'see/hide'
        }
      }
    },
    conflictingConfigChanges: {
      terms: {
        rendered: {
          toggleNsfl: 'show nsfl?'
        }
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
    configChanges: {
      terms: {
        rendered: {
          tableOfContents: 'In This Article'
        }
      }
    },
    conflictingConfigChanges: {
      terms: {
        rendered: {
          tableOfContents: 'Skip To…'
        }
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
    configChanges: {
      renderUnsafeContent: true
    },
    conflictingConfigChanges: {
      renderUnsafeContent: false
    }
  })
})
