import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { UserProvidedSettings } from '../../../UserProvidedSettings'


// Elsewhere, we test how these settings work.
//
// Here, we simply make sure the associated config settings are applied as advertised
// no matter how they are supplied. 

function itWorksAsAdvertised(
  args: {
    markup: string,
    documentWhenChangeIsApplied: UpDocument
    documentWhenSettingIsNotChanged: UpDocument
    configWithSettingChanged: UserProvidedSettings.Parsing
    configWithSettingSetToDefault: UserProvidedSettings.Parsing
  }
): void {
  const { markup, documentWhenChangeIsApplied, documentWhenSettingIsNotChanged, configWithSettingChanged, configWithSettingSetToDefault } = args

  // First, let's make sure the caller is expecting their config changes to make a difference
  expect(documentWhenChangeIsApplied).to.not.deep.equal(documentWhenSettingIsNotChanged)


  context('is disabled by default', () => {
    specify('when the default parse method is called', () => {
      expect(Up.parse(markup)).to.deep.equal(documentWhenSettingIsNotChanged)
    })

    specify('when the parse method is called on an Up object', () => {
      expect(new Up().parse(markup)).to.deep.equal(documentWhenSettingIsNotChanged)
    })
  })


  context('works when enabled', () => {
    specify('when calling the default parse method', () => {
      expect(Up.parse(markup, configWithSettingChanged)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when creating an Up object', () => {
      expect(new Up(configWithSettingChanged).parse(markup)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when calling the parse method on an Up object', () => {
      expect(new Up().parse(markup, configWithSettingChanged)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when calling the parse method on an Up object that had the setting explictly set to default when the object was created', () => {
      expect(new Up(configWithSettingSetToDefault).parse(markup, configWithSettingChanged)).to.deep.equal(documentWhenChangeIsApplied)
    })
  })


  specify('can be set back to default when calling the parse method on an Up object that had the setting changed when the object was created', () => {
    expect(new Up(configWithSettingChanged).parse(markup, configWithSettingSetToDefault)).to.deep.equal(documentWhenSettingIsNotChanged)
  })


  context('does not affect subsequent calls when provided', () => {
    specify('when calling the default parse method', () => {
      expect(Up.parse(markup, configWithSettingChanged)).to.be.not.eql(Up.parse(markup))
    })

    specify('when calling the parse method on an Up object', () => {
      const up = new Up()
      expect(up.parse(markup, configWithSettingChanged)).to.be.not.eql(up.parse(markup))
    })
  })
}


describe('The "createSourceMap" config setting', () => {
  const headingWithSourceMap =
    new Heading([new PlainText('Very important')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

  const headingWithoutSourceMap =
    new Heading([new PlainText('Very important')], { level: 1, ordinalInTableOfContents: 1 })

  itWorksAsAdvertised({
    markup: `
Very important
==============`,

    documentWhenChangeIsApplied: new UpDocument(
      [headingWithSourceMap],
      new UpDocument.TableOfContents([headingWithSourceMap])),

    documentWhenSettingIsNotChanged: new UpDocument(
      [headingWithoutSourceMap],
      new UpDocument.TableOfContents([headingWithoutSourceMap])),

    configWithSettingChanged: {
      createSourceMap: true
    },

    configWithSettingSetToDefault: {
      createSourceMap: false
    }
  })
})


describe('The "defaultUrlScheme" config setting', () => {
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


describe('The "ellipsis" config setting', () => {
  itWorksAsAdvertised({
    markup: 'I think so...',

    documentWhenChangeIsApplied: new UpDocument([
      new Paragraph([
        new PlainText('I think so⋯')
      ])
    ]),

    documentWhenSettingIsNotChanged: new UpDocument([
      new Paragraph([
        new PlainText('I think so…')
      ])
    ]),

    configWithSettingChanged: {
      ellipsis: '⋯'
    },

    configWithSettingSetToDefault: {
      ellipsis: '…'
    }
  })
})


describe('The "baseForUrlsStartingWithSlash" config setting', () => {
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


describe('The "baseForUrlsStartingWithHashMark" config setting', () => {
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
