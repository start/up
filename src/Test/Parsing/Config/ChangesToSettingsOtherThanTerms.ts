import { expect } from 'chai'
import { Up } from '../../../Up'
import { settingsFor } from './Helpers'
import { Document } from '../../../SyntaxNodes/Document'
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
    documentWhenChangeIsApplied: Document
    documentWhenSettingIsNotChanged: Document
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


describe('The "createSourceMap" setting', () => {
  const headingWithSourceMap =
    new Heading([new PlainText('Very important')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

  const headingWithoutSourceMap =
    new Heading([new PlainText('Very important')], { level: 1, ordinalInTableOfContents: 1 })

  itWorksAsAdvertised({
    markup: `
Very important
==============`,

    documentWhenChangeIsApplied: new Document(
      [headingWithSourceMap],
      new Document.TableOfContents([headingWithSourceMap])),

    documentWhenSettingIsNotChanged: new Document(
      [headingWithoutSourceMap],
      new Document.TableOfContents([headingWithoutSourceMap])),

    change: {
      createSourceMap: true
    },

    conflictingChange: {
      createSourceMap: false
    }
  })
})


describe('The "defaultUrlScheme" setting', () => {
  itWorksAsAdvertised({
    markup: '[See users] (example.com/users)',

    documentWhenChangeIsApplied: new Document([
      new Paragraph([
        new Link([new PlainText('See users')], 'my-app://example.com/users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Document([
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


describe('The "fancyEllipsis" setting', () => {
  itWorksAsAdvertised({
    markup: 'I think so...',

    documentWhenChangeIsApplied: new Document([
      new Paragraph([
        new PlainText('I think so⋯')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Document([
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


describe('The "baseForUrlsStartingWithSlash" setting', () => {
  itWorksAsAdvertised({
    markup: '[See users] (/users)',

    documentWhenChangeIsApplied: new Document([
      new Paragraph([
        new Link([new PlainText('See users')], 'my-app://example.com/see/users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Document([
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


describe('The "baseForUrlsStartingWithHashMark" setting', () => {
  itWorksAsAdvertised({
    markup: '[See users] (#users)',

    documentWhenChangeIsApplied: new Document([
      new Paragraph([
        new Link([new PlainText('See users')], 'my-app://example.com/see#users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Document([
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
