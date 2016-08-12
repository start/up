import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ConfigSettings } from '../../../ConfigSettings'


// Elsewhere, we test the creation of tables of contents. Same with the creation of source maps.
//
// Here, we simply make sure the associated config settings are applied advertised. 

function itWorksAsAdvertised(
  args: {
    markup: string,
    documentWhenSettingIsEnabled: DocumentNode
    documentWhenSettingIsDisabled: DocumentNode
    configWithSettingEnabled: ConfigSettings
    configWithSettingDisabled: ConfigSettings
  }
): void {
  const { markup, documentWhenSettingIsEnabled, documentWhenSettingIsDisabled, configWithSettingEnabled, configWithSettingDisabled } = args

  // First, let's make sure the caller is expecting their config changes to make a difference
  expect(documentWhenSettingIsEnabled).to.not.be.eql(documentWhenSettingIsDisabled)


  context('is disabled by default', () => {
    specify('when the default toAst method is called', () => {
      expect(Up.toAst(markup)).to.be.eql(documentWhenSettingIsDisabled)
    })

    specify('when the toAst method is called on an Up object', () => {
      expect(new Up().toAst(markup)).to.be.eql(documentWhenSettingIsDisabled)
    })
  })


  context('works when enabled', () => {
    specify('when calling the default toAst method', () => {
      expect(Up.toAst(markup, configWithSettingEnabled)).to.be.eql(documentWhenSettingIsEnabled)
    })

    specify('when creating an Up object', () => {
      expect(new Up(configWithSettingEnabled).toAst(markup)).to.be.eql(documentWhenSettingIsEnabled)
    })

    specify('when calling the toAst method on an Up object', () => {
      expect(new Up().toAst(markup, configWithSettingEnabled)).to.be.eql(documentWhenSettingIsEnabled)
    })

    specify('when calling the toAst method on an Up object that had the setting explictly disabled when the object was created', () => {
      expect(new Up(configWithSettingDisabled).toAst(markup, configWithSettingEnabled)).to.be.eql(documentWhenSettingIsEnabled)
    })
  })


  specify('can be disabled when calling the toAst method on an Up object that had the setting enabled when the object was created', () => {
    expect(new Up(configWithSettingEnabled).toAst(markup, configWithSettingDisabled)).to.be.eql(documentWhenSettingIsDisabled)
  })


  context('does not affect subsequent calls when provided', () => {
    specify('when calling the default toAst method', () => {
      expect(Up.toAst(markup, configWithSettingEnabled)).to.be.not.eql(Up.toAst(markup))
    })

    specify('when calling the toAst method on an Up object', () => {
      const up = new Up()
      expect(up.toAst(markup, configWithSettingEnabled)).to.be.not.eql(up.toAst(markup))
    })
  })
}


const markup = `
Very important
==============`


describe('The "createTableOfContents" config term', () => {
  itWorksAsAdvertised({
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
  itWorksAsAdvertised({
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
