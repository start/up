import { expect } from 'chai'
import Up from '../../../index'
import { settingsFor } from './Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { UserProvidedSettings } from '../../../UserProvidedSettings'


// Elsewhere, we verify that these settings work.
//
// Here, we simply make sure they work as advertised no matter how they are supplied. 

function itWorksAsAdvertised(
  args: {
    markup: string,
    documentWhenChangeIsApplied: UpDocument
    documentWhenSettingIsNotChanged: UpDocument
    change: UserProvidedSettings.Parsing
    conflictingChange: UserProvidedSettings.Parsing
  }
): void {
  const { markup, documentWhenChangeIsApplied, documentWhenSettingIsNotChanged, change, conflictingChange } = args

  // First, let's make sure the caller is expecting their settings changes to make a difference
  expect(documentWhenChangeIsApplied).to.not.deep.equal(documentWhenSettingIsNotChanged)

  // Next, we'll produce "overall" settings (which cover both parsing and rendering
  // settings). Up's constructor accepts these settings. 
  const changedSettings = settingsFor(change)
  const conflictingChangedSettings = settingsFor(conflictingChange)

  // And now we're ready to test!

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
      expect(Up.parse(markup, change)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when creating an Up object', () => {
      expect(new Up(changedSettings).parse(markup)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when calling the parse method on an Up object', () => {
      expect(new Up().parse(markup, change)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when calling the parse method on an Up object that had the setting explictly set to default when the object was created', () => {
      expect(new Up(conflictingChangedSettings).parse(markup, change)).to.deep.equal(documentWhenChangeIsApplied)
    })
  })


  specify('can be set back to default when calling the parse method on an Up object that had the setting changed when the object was created', () => {
    expect(new Up(changedSettings).parse(markup, conflictingChange)).to.deep.equal(documentWhenSettingIsNotChanged)
  })


  context('does not affect subsequent calls when provided', () => {
    specify('when calling the default parse method', () => {
      expect(Up.parse(markup, change)).to.be.not.eql(Up.parse(markup))
    })

    specify('when calling the parse method on an Up object', () => {
      const up = new Up()
      expect(up.parse(markup, change)).to.be.not.eql(up.parse(markup))
    })
  })
}


describe('The "createSourceMap" settings setting', () => {
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

    change: {
      createSourceMap: true
    },

    conflictingChange: {
      createSourceMap: false
    }
  })
})


describe('The "defaultUrlScheme" settings setting', () => {
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

    change: {
      defaultUrlScheme: 'my-app://'
    },

    conflictingChange: {
      defaultUrlScheme: 'https://'
    }
  })
})


describe('The "fancyEllipsis" settings setting', () => {
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

    change: {
      fancyEllipsis: '⋯'
    },

    conflictingChange: {
      fancyEllipsis: '…'
    }
  })
})


describe('The "baseForUrlsStartingWithSlash" settings setting', () => {
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

    change: {
      baseForUrlsStartingWithSlash: 'my-app://example.com/see'
    },

    conflictingChange: {
      baseForUrlsStartingWithSlash: ''
    }
  })
})


describe('The "baseForUrlsStartingWithHashMark" settings setting', () => {
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

    change: {
      baseForUrlsStartingWithHashMark: 'my-app://example.com/see'
    },

    conflictingChange: {
      baseForUrlsStartingWithHashMark: ''
    }
  })
})
