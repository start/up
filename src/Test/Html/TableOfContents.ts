import { expect } from 'chai'
import * as Up from '../../index'


context('A table of contents produces <nav class="up-table-of-contents"> starting with an <h1> containing the term for "Table of Contents".', () => {
  specify('When a document has no table of contents entries, the HTML for the table of contents consists only of the above', () => {
    const document =
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Heading([new Up.Text('I enjoy apples')], { level: 1 })
        ])
      ])

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">reveal</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<h1>I enjoy apples</h1>'
      + '</div>'
      + '</div>')
  })


  context("Following is an <ul> containing a <li> for each entry. In each <li> is a heading that's one level higher than the heading the entry references", () => {
    specify('A level 1 heading entry is placed in an <h2>', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderDocumentAndTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<h1 id="up-topic-1">I enjoy apples</h1>')
    })

    specify('A level 2 heading entry is placed in an <h3>', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 2, ordinalInTableOfContents: 1 })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderDocumentAndTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h3><a href="#up-topic-1">I enjoy apples</a></h3></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<h2 id="up-topic-1">I enjoy apples</h2>')
    })

    specify('A level 3 heading entry is placed in an <h4>', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 3, ordinalInTableOfContents: 1 })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderDocumentAndTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h4><a href="#up-topic-1">I enjoy apples</a></h4></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<h3 id="up-topic-1">I enjoy apples</h3>')
    })

    specify('A level 4 heading entry entry contains an <h5>', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 4, ordinalInTableOfContents: 1 })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderDocumentAndTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h5><a href="#up-topic-1">I enjoy apples</a></h5></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<h4 id="up-topic-1">I enjoy apples</h4>')
    })

    specify('A level 5 heading entry is placed in an <h6>', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 5, ordinalInTableOfContents: 1 })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderDocumentAndTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h6><a href="#up-topic-1">I enjoy apples</a></h6></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<h5 id="up-topic-1">I enjoy apples</h5>')
    })

    context("HTML heading levels don't go higher than <h6>, so all subsequent heading levels produce <h6> table of contents entries.", () => {
      specify('A level 6 heading entry is placed in an <h6>', () => {
        const heading =
          new Up.Heading([new Up.Text('I enjoy apples')], { level: 6, ordinalInTableOfContents: 1 })

        const document =
          new Up.Document([heading], new Up.Document.TableOfContents([heading]))

        const { tableOfContentsHtml, documentHtml } =
          Up.renderDocumentAndTableOfContents(document)

        expect(tableOfContentsHtml).to.equal(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h6><a href="#up-topic-1">I enjoy apples</a></h6></li>'
          + '</ul>'
          + '</nav>')

        expect(documentHtml).to.equal(
          '<h6 id="up-topic-1">I enjoy apples</h6>')
      })

      specify('A level 10 heading entry is placed in an <h6>', () => {
        const heading =
          new Up.Heading([new Up.Text('I enjoy apples')], { level: 6, ordinalInTableOfContents: 1 })

        const document =
          new Up.Document([heading], new Up.Document.TableOfContents([heading]))

        const { tableOfContentsHtml, documentHtml } =
          Up.renderDocumentAndTableOfContents(document)

        expect(tableOfContentsHtml).to.equal(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h6><a href="#up-topic-1">I enjoy apples</a></h6></li>'
          + '</ul>'
          + '</nav>')

        expect(documentHtml).to.equal(
          '<h6 id="up-topic-1">I enjoy apples</h6>')
      })
    })
  })
})


context("The table of contents has no effect on elements that aren't referenced by it", () => {
  specify("even when syntax nodes represented by those elements are otherwise identical", () => {
    const headingInTableOfContents =
      new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        headingInTableOfContents,
        new Up.RevealableBlock([
          new Up.Heading([new Up.Text('I enjoy apples')], { level: 1 })
        ])
      ], new Up.Document.TableOfContents([headingInTableOfContents]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">I enjoy apples</h1>'
      + '<div class="up-revealable">'
      + '<label for="up-revealable-1">reveal</label>'
      + '<input id="up-revealable-1" role="button" type="checkbox">'
      + '<div role="alert">'
      + '<h1>I enjoy apples</h1>'
      + '</div>'
      + '</div>')
  })
})


context('When a table of contents has multiple entries', () => {
  specify('the ID of each element referenced by the table of contents ends with a number corresponding to its ordinal (1-based) in the table of contents', () => {
    const heading1 =
      new Up.Heading([new Up.Text('Vegetables')], { level: 1, ordinalInTableOfContents: 1 })

    const heading2 =
      new Up.Heading([new Up.Text('Fruit')], { level: 1, ordinalInTableOfContents: 2 })

    const heading3 =
      new Up.Heading([new Up.Text('Apples')], { level: 2, ordinalInTableOfContents: 3 })

    const heading4 =
      new Up.Heading([new Up.Text('Green apples')], { level: 3, ordinalInTableOfContents: 4 })

    const heading5 =
      new Up.Heading([new Up.Text('Grains')], { level: 1, ordinalInTableOfContents: 5 })

    const heading6 =
      new Up.Heading([new Up.Text('Rice')], { level: 2, ordinalInTableOfContents: 6 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading1, heading2, heading3, heading4, heading5, heading6])

    const document = new Up.Document([
      heading1,

      new Up.UnorderedList([
        new Up.UnorderedList.Item([

          new Up.OrderedList([
            new Up.OrderedList.Item([
              heading2,

              new Up.DescriptionList([
                new Up.DescriptionList.Item([
                  new Up.DescriptionList.Item.Subject([new Up.Text('Apple')])
                ], new Up.DescriptionList.Item.Description([
                  heading3, heading4, heading5, heading6
                ]))
              ])
            ])
          ])
        ])
      ])
    ], tableOfContents)

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">Vegetables</a></h2></li>'
      + '<li><h2><a href="#up-topic-2">Fruit</a></h2></li>'
      + '<li><h3><a href="#up-topic-3">Apples</a></h3></li>'
      + '<li><h4><a href="#up-topic-4">Green apples</a></h4></li>'
      + '<li><h2><a href="#up-topic-5">Grains</a></h2></li>'
      + '<li><h3><a href="#up-topic-6">Rice</a></h3></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">Vegetables</h1>'
      + '<ul>'
      + '<li>'
      + '<ol>'
      + '<li>'
      + '<h1 id="up-topic-2">Fruit</h1>'
      + '<dl>'
      + '<dt>Apple</dt>'
      + '<dd>'
      + '<h2 id="up-topic-3">Apples</h2>'
      + '<h3 id="up-topic-4">Green apples</h3>'
      + '<h1 id="up-topic-5">Grains</h1>'
      + '<h2 id="up-topic-6">Rice</h2>'
      + '</dd>'
      + '</dl>'
      + '</li>'
      + '</ol>'
      + '</li>'
      + '</ul>')
  })
})


context("Within the table of contents itself", () => {
  specify('footnotes produce no HTML (they are totally ignored).', () => {
    const topLevelFootnote =
      new Up.Footnote([new Up.Text('Sometimes')], { referenceNumber: 1 })

    const nestedFootnote =
      new Up.Footnote([new Up.Text('Always')], { referenceNumber: 2 })

    const heading =
      new Up.Heading([
        new Up.Text('I enjoy apples'),
        topLevelFootnote,
        new Up.Text(' '),
        new Up.Emphasis([
          new Up.Text('and you should too'),
          nestedFootnote
        ])
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([
        heading,
        new Up.FootnoteBlock([topLevelFootnote, nestedFootnote])
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">I enjoy apples <em>and you should too</em></a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">'
      + 'I enjoy apples'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-1">'
      + '<a href="#up-footnote-1">1</a>'
      + '</sup>'
      + ' <em>'
      + 'and you should too'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-2">'
      + '<a href="#up-footnote-2">2</a>'
      + '</sup>'
      + '</em>'
      + '</h1>'
      + '<dl class="up-footnotes">'
      + '<dt id="up-footnote-1"><a href="#up-footnote-reference-1">1</a></dt><dd>Sometimes</dd>'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Always</dd>'
      + '</dl>')
  })
})


context("Within the table of contents, the IDs of revealable content elements do not clash with those in the document:", () => {
  specify('Inline spoilers', () => {
    const applesHeading =
      new Up.Heading([
        new Up.Text('I enjoy apples '),
        new Up.InlineRevealable([new Up.Text('sometimes')])
      ], { level: 1, ordinalInTableOfContents: 1 })

    const grapesHeading =
      new Up.Heading([
        new Up.Text('I enjoy grapes '),
        new Up.InlineRevealable([new Up.Text('usually')])
      ], { level: 1, ordinalInTableOfContents: 2 })

    const document =
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineRevealable([new Up.Text('Never')]),
          new Up.Text(' eat apples.'),
        ]),
        applesHeading,
        grapesHeading,
      ], new Up.Document.TableOfContents([applesHeading, grapesHeading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-toc-spoiler-1">toggle spoiler</label>'
      + '<input id="up-toc-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a></h2></li>'
      + '<li><h2><a href="#up-topic-2">'
      + 'I enjoy grapes '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-toc-spoiler-2">toggle spoiler</label>'
      + '<input id="up-toc-spoiler-2" role="button" type="checkbox">'
      + '<span role="alert">usually</span>'
      + '</span>'
      + '</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<h1 id="up-topic-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-2">toggle spoiler</label>'
      + '<input id="up-spoiler-2" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</h1>'
      + '<h1 id="up-topic-2">'
      + 'I enjoy grapes '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-3">toggle spoiler</label>'
      + '<input id="up-spoiler-3" role="button" type="checkbox">'
      + '<span role="alert">usually</span>'
      + '</span>'
      + '</h1>')
  })
})


context("When an item referenced by the table of contents has a source line number", () => {
  specify("its entry within the <nav> element of the table of contents isn't given a 'data-up-source-line' attribute", () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 data-up-source-line="2" id="up-topic-1">I enjoy apples</h1>')
  })
})


context('When a section link node is associated with an entry', () => {
  specify("it produces a link to the actual entry in the document. The link's contents are the same as the entry's contents within the <nav> element of the table of contents", () => {
    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    const document =
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm a great guy. For more information, skip to "),
          new Up.SectionLink('never', neverLieHeading),
          new Up.Text('.')
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">I drink soda</a></h2></li>'
      + '<li><h2><a href="#up-topic-2">I never lie</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<p>'
      + "I'm a great guy. For more information, skip to "
      + '<a href="#up-topic-2">I never lie</a>'
      + '.'
      + '</p>'
      + '<h1 id="up-topic-1">I drink soda</h1>'
      + '<p>Actually, I only drink milk.</p>'
      + '<h1 id="up-topic-2">I never lie</h1>'
      + '<p>Not quite true.</p>')
  })
})
