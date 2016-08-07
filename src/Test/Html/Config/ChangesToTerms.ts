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
    htmlFromDefaultSettings: string
    configChanges: UpConfigSettings
    conflictingConfigChanges: UpConfigSettings
  }
): void {
  const { documentNode, htmlFromDefaultSettings, configChanges, conflictingConfigChanges } = args


  describe("when provided to the default toHtml method", () => {
    it("does not alter subsequent calls to the default method", () => {
      // Let's make sure the config changes would change the HTML
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

      // We don't care about the result! We only care to ensure the original config settings weren't overwritten.
      up.toHtml(documentNode, conflictingConfigChanges)

      expect(whenProvidingConfigAtCreation).to.be.eql(up.toHtml(documentNode, configChanges))
    })
  })


  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.toHtml(documentNode, configChanges)

  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().toHtml(documentNode, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).toHtml(documentNode, configChanges)


  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the term when calling the default toHtml method', () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
    })

    it("has the same result as providing the term when calling the Up object's toHtml method", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingtMethodOnObject)
    })

    it("has the same result as providing the term when calling the Up object's toHtml method, overwriting the term provided at creation", () => {
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
    htmlFromDefaultSettings: '<p><sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup></p>',
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
    htmlFromDefaultSettings: '<p><sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup></p>',
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
    htmlFromDefaultSettings: '<p><sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup></p>',
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
    htmlFromDefaultSettings: '<p><sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup></p>',
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
    htmlFromDefaultSettings:
    '<p>'
    + '<span class="up-spoiler up-revealable">'
    + '<label for="up-spoiler-1">toggle spoiler</label>'
    + '<input id="up-spoiler-1" type="checkbox">'
    + '<span></span>'
    + '</span>'
    + '</p>',
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
    htmlFromDefaultSettings:
    '<p>'
    + '<span class="up-spoiler up-revealable">'
    + '<label for="up-spoiler-1">toggle spoiler</label>'
    + '<input id="up-spoiler-1" type="checkbox">'
    + '<span></span>'
    + '</span>'
    + '</p>',
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
    htmlFromDefaultSettings:
    '<p>'
    + '<span class="up-nsfw up-revealable">'
    + '<label for="up-nsfw-1">toggle NSFW</label>'
    + '<input id="up-nsfw-1" type="checkbox">'
    + '<span></span>'
    + '</span>'
    + '</p>',
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
    htmlFromDefaultSettings:
    '<p>'
    + '<span class="up-nsfw up-revealable">'
    + '<label for="up-nsfw-1">toggle NSFW</label>'
    + '<input id="up-nsfw-1" type="checkbox">'
    + '<span></span>'
    + '</span>'
    + '</p>',
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
    htmlFromDefaultSettings:
    '<p>'
    + '<span class="up-nsfl up-revealable">'
    + '<label for="up-nsfl-1">toggle NSFL</label>'
    + '<input id="up-nsfl-1" type="checkbox">'
    + '<span></span>'
    + '</span>'
    + '</p>',
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
    htmlFromDefaultSettings:
    '<p>'
    + '<span class="up-nsfl up-revealable">'
    + '<label for="up-nsfl-1">toggle NSFL</label>'
    + '<input id="up-nsfl-1" type="checkbox">'
    + '<span></span>'
    + '</span>'
    + '</p>',
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
    htmlFromDefaultSettings:
    '<nav class="up-table-of-contents">'
    + '<h1>Table of Contents</h1>'
    + '<ul>'
    + '<li><h2><a href="#up-part-1"></a></h2></li>'
    + '</ul>'
    + '</nav>'
    + '<h1 id="up-part-1"></h1>',
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
