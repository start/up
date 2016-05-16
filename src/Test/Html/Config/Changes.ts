import { expect } from 'chai'
import { UpConfigArgs } from '../../../UpConfigArgs'
import { Up } from '../../../index'
import { SyntaxNode } from '../../../SyntaxNodes/SyntaxNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    node: SyntaxNode,
    htmlFromDefaultSettings: string
    configChanges: UpConfigArgs,
    conflictingConfigChanges: UpConfigArgs
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
    htmlFromDefaultSettings: '<sup id="footnote-reference-3" data-footnote-reference><a href="#footnote-3">3</a></sup>',
    configChanges: {
      documentName: 'reply 11'
    },
    conflictingConfigChanges: {
      documentName: 'op'
    }
  })
})