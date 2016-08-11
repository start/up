import { expect } from 'chai'
import Up from '../../../index'
import { ConfigSettings } from '../../../ConfigSettings'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    document: DocumentNode
    configChanges: ConfigSettings
    conflictingConfigChanges: ConfigSettings
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
    document: new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
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


describe('The "wordDelimiterForGeneratedIds" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ]),
    configChanges: {
      i18n: {
        wordDelimiterForGeneratedIds: '::'
      }
    },
    conflictingConfigChanges: {
      i18n: {
        wordDelimiterForGeneratedIds: '_'
      }
    }
  })
})


describe('The "footnote reference" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          footnoteReference: 'ref'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          footnoteReference: 'fn ref'
        }
      }
    }
  })
})


describe('The "footnote" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          footnote: 'fn'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          footnote: 'note'
        }
      }
    }
  })
})


describe('The "spoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          spoiler: 'look away'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          spoiler: 'ruins ending'
        }
      }
    }
  })
})


describe('The "toggleSpoiler" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          toggleSpoiler: 'show/hide'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          toggleSpoiler: 'see spoiler?'
        }
      }
    }
  })
})


describe('The "nsfw" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          nsfw: 'look away'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          nsfw: 'explicit'
        }
      }
    }
  })
})


describe('The "toggleNsfw" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          toggleNsfw: 'see/hide'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          toggleNsfw: 'show nsfw?'
        }
      }
    }
  })
})


describe('The "nsfl" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          nsfl: 'look away'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          nsfl: 'explicit'
        }
      }
    }
  })
})


describe('The "toggleNsfl" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ]),
    configChanges: {
      i18n: {
        terms: {
          toggleNsfl: 'see/hide'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          toggleNsfl: 'show nsfl?'
        }
      }
    }
  })
})


describe('The "tableOfContents" config term', () => {
  const heading = new HeadingNode([], 1)

  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode(
      [heading],
      new DocumentNode.TableOfContents([heading])),
    configChanges: {
      i18n: {
        terms: {
          tableOfContents: 'In This Article'
        }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: {
          tableOfContents: 'Skip To...'
        }
      }
    }
  })
})


describe('The "writeUnsafeContent" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    document: new DocumentNode([
      new ParagraphNode([
        new LinkNode([], 'javascript:malicious')
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
