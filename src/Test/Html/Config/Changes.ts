import { expect } from 'chai'
import Up from '../../../index'
import { UpConfigSettings } from '../../../UpConfigSettings'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    documentNode: DocumentNode
    configChanges: UpConfigSettings
    conflictingConfigChanges: UpConfigSettings
  }
): void {
  const { documentNode, configChanges, conflictingConfigChanges } = args

  const htmlFromDefaultSettings =
    Up.toHtml(documentNode)


  describe("when provided to the default toHtml method", () => {
    it("does not alter subsequent calls to the default method", () => {
      // Let's make sure the provided config changes would actually change the HTML
      expect(Up.toHtml(documentNode, configChanges)).to.not.be.eql(htmlFromDefaultSettings)

      // Now, let's make sure the config changes don't alter subsequent calls
      expect(Up.toHtml(documentNode)).to.be.eql(htmlFromDefaultSettings)
    })
  })


  const whenProvidingConfigAtCreation =
    new Up(configChanges).toHtml(documentNode)


  describe("when provided to an Up object's toHtml method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up(configChanges)

      // Let's make sure the provided conflicting changes are actually conflicting
      expect(up.toHtml(documentNode, conflictingConfigChanges)).to.not.be.eql(whenProvidingConfigAtCreation)

      // Now, let's make sure they didn't alter any subsequent calls
      expect(up.toHtml(documentNode, configChanges)).to.be.eql(whenProvidingConfigAtCreation)
    })
  })


  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.toHtml(documentNode, configChanges)

  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().toHtml(documentNode, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).toHtml(documentNode, configChanges)


  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the setting when calling the default toHtml method', () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
    })

    it("has the same result as providing the setting when calling the Up object's toHtml method", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingtMethodOnObject)
    })

    it("has the same result as providing the setting when calling the Up object's toHtml method, overwriting the term provided at creation", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenOverwritingChangesProvidedAtCreation)
    })
  })
}


describe('The "documentName" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    documentNode: new DocumentNode([
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


describe('The "idWordDelimiter" config setting', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    documentNode: new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ]),
    configChanges: {
      i18n: {
        idWordDelimiter: '::'
      }
    },
    conflictingConfigChanges: {
      i18n: {
        idWordDelimiter: '_'
      }
    }
  })
})


describe('The "footnote reference" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode([
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
    documentNode: new DocumentNode(
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
