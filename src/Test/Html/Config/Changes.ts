import { expect } from 'chai'
import Up from '../../../index'
import { UpConfigSettings } from '../../../UpConfigSettings'
import { SyntaxNode } from '../../../SyntaxNodes/SyntaxNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    node: SyntaxNode,
    htmlFromDefaultSettings: string
    configChanges: UpConfigSettings,
    conflictingConfigChanges: UpConfigSettings
  }
): void {

  const { node, htmlFromDefaultSettings, configChanges, conflictingConfigChanges } = args


  describe("when provided to the default (static) toHtml method", () => {
    it("does not alter subsequent calls to the default method", () => {
      // We don't care about the result! We only care to ensure these config settings don't apply to subsequent calls.
      Up.toHtml(node, configChanges)
      
      expect(Up.toHtml(node)).to.be.eql(htmlFromDefaultSettings)
    })
  })

  const whenProvidingConfigAtCreation =
    new Up(configChanges).toHtml(node)

  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.toHtml(node, configChanges)
    
  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().toHtml(node, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).toHtml(node, configChanges)

  describe("when provided to an Up object's toHtml method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up(configChanges)

      // We don't care about the result! We only care to ensure the original config settings weren't overwritten.
      up.toHtml(node, conflictingConfigChanges)

      expect(whenProvidingConfigAtCreation).to.be.eql(up.toHtml(node, configChanges))
    })
  })

  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the term when calling the (default) static toHtml method', () => {
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
    node: new FootnoteNode([], 3),
    htmlFromDefaultSettings: '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>',
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
    node: new FootnoteNode([], 3),
    htmlFromDefaultSettings: '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>',
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
    node: new FootnoteNode([], 3),
    htmlFromDefaultSettings: '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>',
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
    node: new FootnoteNode([], 3),
    htmlFromDefaultSettings: '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>',
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
