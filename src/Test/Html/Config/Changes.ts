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
    Up.toHtml(document)


  describe("when provided to the default toHtml method", () => {
    it("does not alter subsequent calls to the default method", () => {
      // Let's make sure the provided config changes would actually change the HTML
      expect(Up.toHtml(document, configChanges)).to.not.be.eql(htmlFromDefaultSettings)

      // Now, let's make sure the config changes don't alter subsequent calls
      expect(Up.toHtml(document)).to.be.eql(htmlFromDefaultSettings)
    })
  })


  const whenProvidingConfigAtCreation =
    new Up(configChanges).toHtml(document)


  describe("when provided to an Up object's toHtml method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up(configChanges)

      // Let's make sure the provided conflicting changes are actually conflicting
      expect(up.toHtml(document, conflictingConfigChanges)).to.not.be.eql(whenProvidingConfigAtCreation)

      // Now, let's make sure they didn't alter any subsequent calls
      expect(up.toHtml(document, configChanges)).to.be.eql(whenProvidingConfigAtCreation)
    })
  })


  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.toHtml(document, configChanges)

  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().toHtml(document, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).toHtml(document, configChanges)


  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the setting when calling the default toHtml method', () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
    })

    it("has the same result as providing the setting when calling the Up object's toHtml method", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingtMethodOnObject)
    })

    it("has the same result as providing the setting when calling the Up object's toHtml method, overwriting the setting provided at creation", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenOverwritingChangesProvidedAtCreation)
    })
  })
}


describe('The "documentName" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ]),
    configChanges: {
      documentName: 'reply 11'
    },
    conflictingConfigChanges: {
      documentName: 'op'
    }
  })
})


describe('The "footnote reference" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ]),
    configChanges: {
      terms: {
        footnoteReference: 'ref'
      }
    },
    conflictingConfigChanges: {
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
        new Footnote([], 3)
      ])
    ]),
    configChanges: {
      terms: {
        footnote: 'fn'
      }
    },
    conflictingConfigChanges: {
      terms: {
        footnote: 'note'
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
        toggleSpoiler: 'show/hide'
      }
    },
    conflictingConfigChanges: {
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
    configChanges: {
      terms: {
        toggleNsfw: 'see/hide'
      }
    },
    conflictingConfigChanges: {
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
    configChanges: {
      terms: {
        toggleNsfl: 'see/hide'
      }
    },
    conflictingConfigChanges: {
      terms: {
        toggleNsfl: 'show nsfl?'
      }
    }
  })
})


describe('The "tableOfContents" config setting', () => {
  const heading = new Heading([], 1)

  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument(
      [heading],
      new UpDocument.TableOfContents([heading])),
    configChanges: {
      terms: {
        tableOfContents: 'In This Article'
      }
    },
    conflictingConfigChanges: {
      terms: {
        tableOfContents: 'Skip To...'
      }
    }
  })
})


describe('The "writeUnsafeContent" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new UpDocument([
      new Paragraph([
        new Link([], 'javascript:malicious')
      ])
    ]),
    configChanges: {
      writeUnsafeContent: true
    },
    conflictingConfigChanges: {
      writeUnsafeContent: false
    }
  })
})
