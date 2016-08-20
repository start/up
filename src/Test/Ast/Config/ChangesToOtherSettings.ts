import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { UserProvidedSettings } from '../../../UserProvidedSettings'


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
    documentWhenChangeIsApplied: UpDocument
    documentWhenSettingIsNotChanged: UpDocument
    configWithSettingChanged: UserProvidedSettings
    configWithSettingSetToDefault: UserProvidedSettings
  }
): void {
  const { markup, documentWhenChangeIsApplied, documentWhenSettingIsNotChanged, configWithSettingChanged, configWithSettingSetToDefault } = args

  // First, let's make sure the caller is expecting their config changes to make a difference
  expect(documentWhenChangeIsApplied).to.not.be.eql(documentWhenSettingIsNotChanged)


  context('is disabled by default', () => {
    specify('when the default toDocument method is called', () => {
      expect(Up.toDocument(markup)).to.be.eql(documentWhenSettingIsNotChanged)
    })

    specify('when the toDocument method is called on an Up object', () => {
      expect(new Up().toDocument(markup)).to.be.eql(documentWhenSettingIsNotChanged)
    })
  })


  context('works when enabled', () => {
    specify('when calling the default toDocument method', () => {
      expect(Up.toDocument(markup, configWithSettingChanged)).to.be.eql(documentWhenChangeIsApplied)
    })

    specify('when creating an Up object', () => {
      expect(new Up(configWithSettingChanged).toDocument(markup)).to.be.eql(documentWhenChangeIsApplied)
    })

    specify('when calling the toDocument method on an Up object', () => {
      expect(new Up().toDocument(markup, configWithSettingChanged)).to.be.eql(documentWhenChangeIsApplied)
    })

    specify('when calling the toDocument method on an Up object that had the setting explictly set to default when the object was created', () => {
      expect(new Up(configWithSettingSetToDefault).toDocument(markup, configWithSettingChanged)).to.be.eql(documentWhenChangeIsApplied)
    })
  })


  specify('can be set back to default when calling the toDocument method on an Up object that had the setting changed when the object was created', () => {
    expect(new Up(configWithSettingChanged).toDocument(markup, configWithSettingSetToDefault)).to.be.eql(documentWhenSettingIsNotChanged)
  })


  context('does not affect subsequent calls when provided', () => {
    specify('when calling the default toDocument method', () => {
      expect(Up.toDocument(markup, configWithSettingChanged)).to.be.not.eql(Up.toDocument(markup))
    })

    specify('when calling the toDocument method on an Up object', () => {
      const up = new Up()
      expect(up.toDocument(markup, configWithSettingChanged)).to.be.not.eql(up.toDocument(markup))
    })
  })
}


describe('The "createSourceMap" config term', () => {
  itWorksAsAdvertised({
    markup: `
Very important
==============`,

    documentWhenChangeIsApplied: new UpDocument([
      new Heading([new PlainText('Very important')], 1, 2)
    ]),

    documentWhenSettingIsNotChanged: new UpDocument([
      new Heading([new PlainText('Very important')], 1)
    ]),

    configWithSettingChanged: {
      createSourceMap: true
    },

    configWithSettingSetToDefault: {
      createSourceMap: false
    }
  })
})


describe('The "defaultUrlScheme" config term', () => {
  itWorksAsAdvertised({
    markup: '[See users] (example.com/users)',

    documentWhenChangeIsApplied: new UpDocument([
      new Paragraph([
        new Link([new PlainText('See users')], 'my-app://example.com/users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new UpDocument([
      new Paragraph([
        new Link([new PlainText('See users')], 'https://example.com/users')
      ])
    ]),

    configWithSettingChanged: {
      defaultUrlScheme: 'my-app://'
    },

    configWithSettingSetToDefault: {
      defaultUrlScheme: 'https://'
    }
  })
})


describe('The "baseForUrlsStartingWithSlash" config term', () => {
  itWorksAsAdvertised({
    markup: '[See users] (/users)',

    documentWhenChangeIsApplied: new UpDocument([
      new Paragraph([
        new Link([new PlainText('See users')], 'my-app://example.com/see/users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new UpDocument([
      new Paragraph([
        new Link([new PlainText('See users')], '/users')
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


describe('The "baseForUrlsStartingWithHashMark" config term', () => {
  itWorksAsAdvertised({
    markup: '[See users] (#users)',

    documentWhenChangeIsApplied: new UpDocument([
      new Paragraph([
        new Link([new PlainText('See users')], 'my-app://example.com/see#users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new UpDocument([
      new Paragraph([
        new Link([new PlainText('See users')], '#users')
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
