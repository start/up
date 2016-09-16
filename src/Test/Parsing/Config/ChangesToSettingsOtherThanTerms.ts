import { expect } from 'chai'
import * as Up from '../../../index'
import { settingsFor } from './Helpers'


// Elsewhere, we verify that these settings work.
//
// Here, we simply make sure they work as advertised no matter how they are supplied. 

function itWorksAsAdvertised(
  args: {
    markup: string,
    documentWhenChangeIsApplied: Up.Document
    documentWhenSettingIsNotChanged: Up.Document
    change: Up.UserProvidedSettings.Parsing
    conflictingChange: Up.UserProvidedSettings.Parsing
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

    specify('when the parse method is called on a Transformer object', () => {
      expect(new Up.Transformer().parse(markup)).to.deep.equal(documentWhenSettingIsNotChanged)
    })
  })


  context('works when enabled', () => {
    specify('when calling the default parse method', () => {
      expect(Up.parse(markup, change)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when creating a Transformer object', () => {
      expect(new Up.Transformer(changedSettings).parse(markup)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when calling the parse method on a Transformer object', () => {
      expect(new Up.Transformer().parse(markup, change)).to.deep.equal(documentWhenChangeIsApplied)
    })

    specify('when calling the parse method on a Transformer object that had the setting explictly set to default when the object was created', () => {
      expect(new Up.Transformer(conflictingChangedSettings).parse(markup, change)).to.deep.equal(documentWhenChangeIsApplied)
    })
  })


  specify('can be set back to default when calling the parse method on a Transformer object that had the setting changed when the object was created', () => {
    expect(new Up.Transformer(changedSettings).parse(markup, conflictingChange)).to.deep.equal(documentWhenSettingIsNotChanged)
  })


  context('does not affect subsequent calls when provided', () => {
    specify('when calling the default parse method', () => {
      expect(Up.parse(markup, change)).to.be.not.eql(Up.parse(markup))
    })

    specify('when calling the parse method on a Transformer object', () => {
      const up = new Up.Transformer()
      expect(up.parse(markup, change)).to.be.not.eql(up.parse(markup))
    })
  })
}


describe('The "createSourceMap" setting', () => {
  const headingWithSourceMap =
    new Up.Heading([new Up.Text('Very important')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

  const headingWithoutSourceMap =
    new Up.Heading([new Up.Text('Very important')], { level: 1, ordinalInTableOfContents: 1 })

  itWorksAsAdvertised({
    markup: `
Very important
==============`,

    documentWhenChangeIsApplied: new Up.Document(
      [headingWithSourceMap],
      new Up.Document.TableOfContents([headingWithSourceMap])),

    documentWhenSettingIsNotChanged: new Up.Document(
      [headingWithoutSourceMap],
      new Up.Document.TableOfContents([headingWithoutSourceMap])),

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

    documentWhenChangeIsApplied: new Up.Document([
      new Up.Paragraph([
        new Up.Link([new Up.Text('See users')], 'my-app://example.com/users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Up.Document([
      new Up.Paragraph([
        new Up.Link([new Up.Text('See users')], 'https://example.com/users')
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

    documentWhenChangeIsApplied: new Up.Document([
      new Up.Paragraph([
        new Up.Text('I think so⋯')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Up.Document([
      new Up.Paragraph([
        new Up.Text('I think so…')
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

    documentWhenChangeIsApplied: new Up.Document([
      new Up.Paragraph([
        new Up.Link([new Up.Text('See users')], 'my-app://example.com/see/users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Up.Document([
      new Up.Paragraph([
        new Up.Link([new Up.Text('See users')], '/users')
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

    documentWhenChangeIsApplied: new Up.Document([
      new Up.Paragraph([
        new Up.Link([new Up.Text('See users')], 'my-app://example.com/see#users')
      ])
    ]),

    documentWhenSettingIsNotChanged: new Up.Document([
      new Up.Paragraph([
        new Up.Link([new Up.Text('See users')], '#users')
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
