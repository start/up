import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ConfigSettings } from '../../../ConfigSettings'


// Elsewhere, we test the creation of tables of contents. Same with the creation of source maps.
//
// Here, we simply make sure the associated config settings are applied advertised. 

function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    markup: string,
    documentWhenSettingIsEnabled: DocumentNode
    documentWhenSettingIsDisabled: DocumentNode
    configWithSettingEnabled: ConfigSettings
    configWithSettingDisabled: ConfigSettings
  }
): void {
  const { markup, documentWhenSettingIsEnabled, documentWhenSettingIsDisabled, /*configWithSettingEnabled, configWithSettingDisabled*/ } = args

  // First, let's make sure the caller is expecting their config changes to make a difference
  expect(documentWhenSettingIsEnabled).to.not.be.eql(documentWhenSettingIsDisabled)


  context('is disabled by default', () => {
    it('when the default toAst method is called', () => {
      expect(Up.toAst(markup)).to.be.eql(documentWhenSettingIsDisabled)
    })

    it('when the default toAst method is called', () => {
      expect(new Up().toAst(markup)).to.be.eql(documentWhenSettingIsDisabled)
    })
  })
  /*

  describe("when provided to the default toAst method", () => {
    it("is applied", () => {
      expect(Up.toAst(textForConfigChanges, conflictingConfigChanges)).to.not.be.eql(whenEverythingIsDefault)
    })

    it("does not alter subsequent calls to the default method", () => {
      expect(Up.toAst(textForConfigChanges, configChanges)).to.be.eql(Up.toAst(textForDefaultSettings))
    })

    it("replaces the original term", () => {
      expect(Up.toAst(textForDefaultSettings, configChanges)).to.not.be.eql(whenEverythingIsDefault)
    })
  })


  describe("when provided to an Up object's toAst method", () => {
    const up = new Up(configChanges)

    it("is applied", () => {
      expect(up.toAst(textForConfigChanges, conflictingConfigChanges)).to.not.be.eql(whenEverythingIsDefault)
    })

    it("does not alter the Up object's original settings", () => {
      expect(up.toAst(textForConfigChanges)).to.be.eql(whenEverythingIsDefault)
    })

    it("replaces the original term", () => {
      expect(up.toAst(textForDefaultSettings)).to.not.be.eql(whenEverythingIsDefault)
    })
  })


  const up = new Up(configChanges)

  const whenProvidingChangesAtCreation =
    up.toAst(textForConfigChanges)


  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the term when calling the default toAst method', () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(Up.toAst(textForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toAst method", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up().toAst(textForConfigChanges, configChanges))
    })

    it("has the same result as providing the term when calling the Up object's toAst method, overwriting the term provided at creation", () => {
      expect(whenProvidingChangesAtCreation).to.be.eql(new Up(conflictingConfigChanges).toAst(textForConfigChanges, configChanges))
    })

    it("replaces the original term", () => {
      expect(up.toAst(textForDefaultSettings)).to.not.be.eql(whenEverythingIsDefault)
    })
  })
  */
}


const markup = `
Very important
==============`


describe('The "createTableOfContents" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markup,

    documentWhenSettingIsEnabled: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ], new DocumentNode.TableOfContents([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ])),

    documentWhenSettingIsDisabled: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ]),

    configWithSettingEnabled: {
      createTableOfContents: true
    },

    configWithSettingDisabled: {
      createTableOfContents: false
    }
  })
})


describe('The "createSourceMap" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
    markup,

    documentWhenSettingIsEnabled: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1, 2)
    ]),

    documentWhenSettingIsDisabled: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ]),

    configWithSettingEnabled: {
      createSourceMap: true
    },

    configWithSettingDisabled: {
      createSourceMap: false
    }
  })
})
