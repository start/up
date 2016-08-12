import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ConfigSettings } from '../../../ConfigSettings'


// Elsewhere, we test:
//
// 1. The creation of tables of contents
// 2. The creation of source maps
// 3. The creation of links based on our various base URL settings
//
// Here, we simply make sure the associated config settings are applied as advertised. 

function itWorksAsAdvertised(
  args: {
    markup: string,
    documentWhenChangeIsApplied: DocumentNode
    documentWhenSettingIsNotChanged: DocumentNode
    configWithSettingChanged: ConfigSettings
    configWithSettingSetToDefault: ConfigSettings
  }
): void {
  const { markup, documentWhenChangeIsApplied, documentWhenSettingIsNotChanged, configWithSettingChanged, configWithSettingSetToDefault } = args

  // First, let's make sure the caller is expecting their config changes to make a difference
  expect(documentWhenChangeIsApplied).to.not.be.eql(documentWhenSettingIsNotChanged)


  context('is disabled by default', () => {
    specify('when the default toAst method is called', () => {
      expect(Up.toAst(markup)).to.be.eql(documentWhenSettingIsNotChanged)
    })

    specify('when the toAst method is called on an Up object', () => {
      expect(new Up().toAst(markup)).to.be.eql(documentWhenSettingIsNotChanged)
    })
  })


  context('works when enabled', () => {
    specify('when calling the default toAst method', () => {
      expect(Up.toAst(markup, configWithSettingChanged)).to.be.eql(documentWhenChangeIsApplied)
    })

    specify('when creating an Up object', () => {
      expect(new Up(configWithSettingChanged).toAst(markup)).to.be.eql(documentWhenChangeIsApplied)
    })

    specify('when calling the toAst method on an Up object', () => {
      expect(new Up().toAst(markup, configWithSettingChanged)).to.be.eql(documentWhenChangeIsApplied)
    })

    specify('when calling the toAst method on an Up object that had the setting explictly set to default when the object was created', () => {
      expect(new Up(configWithSettingSetToDefault).toAst(markup, configWithSettingChanged)).to.be.eql(documentWhenChangeIsApplied)
    })
  })


  specify('can be set back to default when calling the toAst method on an Up object that had the setting changed when the object was created', () => {
    expect(new Up(configWithSettingChanged).toAst(markup, configWithSettingSetToDefault)).to.be.eql(documentWhenSettingIsNotChanged)
  })


  context('does not affect subsequent calls when provided', () => {
    specify('when calling the default toAst method', () => {
      expect(Up.toAst(markup, configWithSettingChanged)).to.be.not.eql(Up.toAst(markup))
    })

    specify('when calling the toAst method on an Up object', () => {
      const up = new Up()
      expect(up.toAst(markup, configWithSettingChanged)).to.be.not.eql(up.toAst(markup))
    })
  })
}


describe('The "createTableOfContents" config term', () => {
  itWorksAsAdvertised({
    markup: `
Very important
==============`,

    documentWhenChangeIsApplied: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ], new DocumentNode.TableOfContents([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ])),

    documentWhenSettingIsNotChanged: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ]),

    configWithSettingChanged: {
      createTableOfContents: true
    },

    configWithSettingSetToDefault: {
      createTableOfContents: false
    }
  })
})


describe('The "createSourceMap" config term', () => {
  itWorksAsAdvertised({
    markup: `
Very important
==============`,

    documentWhenChangeIsApplied: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1, 2)
    ]),

    documentWhenSettingIsNotChanged: new DocumentNode([
      new HeadingNode([new PlainTextNode('Very important')], 1)
    ]),

    configWithSettingChanged: {
      createSourceMap: true
    },

    configWithSettingSetToDefault: {
      createSourceMap: false
    }
  })
})


describe('The "baseForUrlsStartingWithHashMark" config term', () => {
  itWorksAsAdvertised({
    markup: '[See users] (#users)',

    documentWhenChangeIsApplied: new DocumentNode([
      new ParagraphNode([
        new LinkNode([new PlainTextNode('See users')], 'my-app://example.com/see#users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new DocumentNode([
      new ParagraphNode([
        new LinkNode([new PlainTextNode('See users')], '#users')
      ])
    ]),

    configWithSettingChanged: {
      baseForUrlsStartingWithHashMark: 'my-app://example.com/see'
    },

    configWithSettingSetToDefault: {
      baseForUrlsStartingWithHashMark: ''
    }
  })
})


describe('The "baseForUrlsStartingWithSlash" config term', () => {
  itWorksAsAdvertised({
    markup: '[See users] (/users)',

    documentWhenChangeIsApplied: new DocumentNode([
      new ParagraphNode([
        new LinkNode([new PlainTextNode('See users')], 'my-app://example.com/see/users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new DocumentNode([
      new ParagraphNode([
        new LinkNode([new PlainTextNode('See users')], '/users')
      ])
    ]),

    configWithSettingChanged: {
      baseForUrlsStartingWithSlash: 'my-app://example.com/see'
    },

    configWithSettingSetToDefault: {
      baseForUrlsStartingWithSlash: ''
    }
  })
})
