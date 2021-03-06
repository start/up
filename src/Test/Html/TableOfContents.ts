import { expect } from 'chai'
import * as Up from '../../Main'


const IGNORED_FIELD: string = null!

specify('When a document has no table of contents entries, the table of contents renders a blank string', () => {
  const document =
    new Up.Document([
      new Up.RevealableBlock([
        new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, titleMarkup: IGNORED_FIELD })
      ])
    ])

  const { tableOfContentsHtml, documentHtml } =
    Up.renderWithTableOfContents(document)

  expect(tableOfContentsHtml).to.be.empty

  expect(documentHtml).to.equal(
    '<div class="up-revealable">'
    + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
    + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
    + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
    + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
    + '<div role="alert">'
    + '<h1>I enjoy apples</h1>'
    + '</div>'
    + '</div>')
})


context("Each table of contents entry renders a heading corresponding to the entry's level.", () => {
  specify('A level 1 entry renders an <h1>', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">I enjoy apples</a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">I enjoy apples</h1>')
  })

  specify('A level 2 entry renders an <h2>', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 2,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h2><a href="#up-topic-1">I enjoy apples</a></h2>')

    expect(documentHtml).to.equal(
      '<h2 id="up-topic-1">I enjoy apples</h2>')
  })

  specify('A level 3 entry renders an <h3>', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 3,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h3><a href="#up-topic-1">I enjoy apples</a></h3>')

    expect(documentHtml).to.equal(
      '<h3 id="up-topic-1">I enjoy apples</h3>')
  })

  specify('A level 4 entry renders an <h4>', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 4,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h4><a href="#up-topic-1">I enjoy apples</a></h4>')

    expect(documentHtml).to.equal(
      '<h4 id="up-topic-1">I enjoy apples</h4>')
  })

  specify('A level 5 entry renders an <h5>', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 5,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h5><a href="#up-topic-1">I enjoy apples</a></h5>')

    expect(documentHtml).to.equal(
      '<h5 id="up-topic-1">I enjoy apples</h5>')
  })

  specify('A level 6 entry renders an <h6>', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 6,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h6><a href="#up-topic-1">I enjoy apples</a></h6>')

    expect(documentHtml).to.equal(
      '<h6 id="up-topic-1">I enjoy apples</h6>')
  })


  context('Entries of level 7 and up render <div role="heading"> elements with an "aria-level" attribute equal to their level:', () => {
    specify('Level 7', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 7,
          titleMarkup: IGNORED_FIELD,
          ordinalInTableOfContents: 1
        })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderWithTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<div aria-level="7" role="heading"><a href="#up-topic-1">I enjoy apples</a></div>')

      expect(documentHtml).to.equal(
        '<div aria-level="7" id="up-topic-1" role="heading">I enjoy apples</div>')
    })

    specify('Level 8', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 8,
          titleMarkup: IGNORED_FIELD,
          ordinalInTableOfContents: 1
        })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderWithTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<div aria-level="8" role="heading"><a href="#up-topic-1">I enjoy apples</a></div>')

      expect(documentHtml).to.equal(
        '<div aria-level="8" id="up-topic-1" role="heading">I enjoy apples</div>')
    })

    specify('Level 9', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 9,
          titleMarkup: IGNORED_FIELD,
          ordinalInTableOfContents: 1
        })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderWithTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<div aria-level="9" role="heading"><a href="#up-topic-1">I enjoy apples</a></div>')

      expect(documentHtml).to.equal(
        '<div aria-level="9" id="up-topic-1" role="heading">I enjoy apples</div>')
    })

    specify('Level 10', () => {
      const heading =
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 10,
          titleMarkup: IGNORED_FIELD,
          ordinalInTableOfContents: 1
        })

      const document =
        new Up.Document([heading], new Up.Document.TableOfContents([heading]))

      const { tableOfContentsHtml, documentHtml } =
        Up.renderWithTableOfContents(document)

      expect(tableOfContentsHtml).to.equal(
        '<div aria-level="10" role="heading"><a href="#up-topic-1">I enjoy apples</a></div>')

      expect(documentHtml).to.equal(
        '<div aria-level="10" id="up-topic-1" role="heading">I enjoy apples</div>')
    })
  })
})


context("The table of contents has no effect on elements that aren't referenced by it", () => {
  specify('even when syntax nodes represented by those elements are otherwise identical', () => {
    const headingInTableOfContents =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([
        headingInTableOfContents,
        new Up.RevealableBlock([
          new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, titleMarkup: IGNORED_FIELD })
        ])
      ], new Up.Document.TableOfContents([headingInTableOfContents]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">I enjoy apples</a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">I enjoy apples</h1>'
      + '<div class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<div role="alert">'
      + '<h1>I enjoy apples</h1>'
      + '</div>'
      + '</div>')
  })
})


context('When a table of contents has multiple entries', () => {
  specify('the ID of each element referenced by the table of contents ends with a number corresponding to its ordinal (1-based) in the table of contents', () => {
    const heading1 =
      new Up.Heading([new Up.Text('Vegetables')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const heading2 =
      new Up.Heading([new Up.Text('Fruit')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 2
      })

    const heading3 =
      new Up.Heading([new Up.Text('Apples')], {
        level: 2,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 3
      })

    const heading4 =
      new Up.Heading([new Up.Text('Green apples')], {
        level: 3,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 4
      })

    const heading5 =
      new Up.Heading([new Up.Text('Grains')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 5
      })

    const heading6 =
      new Up.Heading([new Up.Text('Rice')], {
        level: 2,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 6
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading1, heading2, heading3, heading4, heading5, heading6])

    const document = new Up.Document([
      heading1,

      new Up.BulletedList([
        new Up.BulletedList.Item([

          new Up.NumberedList([
            new Up.NumberedList.Item([
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
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">Vegetables</a></h1>'
      + '<h1><a href="#up-topic-2">Fruit</a></h1>'
      + '<h2><a href="#up-topic-3">Apples</a></h2>'
      + '<h3><a href="#up-topic-4">Green apples</a></h3>'
      + '<h1><a href="#up-topic-5">Grains</a></h1>'
      + '<h2><a href="#up-topic-6">Rice</a></h2>')

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


context('Within the table of contents itself', () => {
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
      ], {
          level: 1,
          titleMarkup: IGNORED_FIELD,
          ordinalInTableOfContents: 1
        })

    const document =
      new Up.Document([
        heading,
        new Up.FootnoteBlock([topLevelFootnote, nestedFootnote])
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">I enjoy apples <em>and you should too</em></a></h1>')

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


context('Within the table of contents itself', () => {
  specify('the IDs of revealable content elements do not clash with those in the document', () => {
    const applesHeading =
      new Up.Heading([
        new Up.Text('I enjoy apples '),
        new Up.InlineRevealable([new Up.Text('sometimes')])
      ], {
          level: 1,
          titleMarkup: IGNORED_FIELD,
          ordinalInTableOfContents: 1
        })

    const grapesHeading =
      new Up.Heading([
        new Up.Text('I enjoy grapes '),
        new Up.InlineRevealable([new Up.Text('usually')])
      ], {
          level: 1,
          titleMarkup: IGNORED_FIELD,
          ordinalInTableOfContents: 2
        })

    const document =
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineRevealable([new Up.Text('Never')]),
          new Up.Text(' eat apples.')
        ]),
        applesHeading,
        grapesHeading
      ], new Up.Document.TableOfContents([applesHeading, grapesHeading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1>'
      + '<a href="#up-topic-1">'
      + 'I enjoy apples '
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-toc-hide-button-1" name="up-toc-revealable-1" type="radio">'
      + '<label for="up-toc-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-toc-reveal-button-1" name="up-toc-revealable-1" type="radio">'
      + '<label for="up-toc-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a>'
      + '</h1>'
      + '<h1><a href="#up-topic-2">'
      + 'I enjoy grapes '
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-toc-hide-button-2" name="up-toc-revealable-2" type="radio">'
      + '<label for="up-toc-hide-button-2" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-toc-reveal-button-2" name="up-toc-revealable-2" type="radio">'
      + '<label for="up-toc-reveal-button-2" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">usually</span>'
      + '</span>'
      + '</a>'
      + '</h1>')

    expect(documentHtml).to.equal(
      '<p>'
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
      + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<h1 id="up-topic-1">'
      + 'I enjoy apples '
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-2" name="up-revealable-2" type="radio">'
      + '<label for="up-hide-button-2" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-2" name="up-revealable-2" type="radio">'
      + '<label for="up-reveal-button-2" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</h1>'
      + '<h1 id="up-topic-2">'
      + 'I enjoy grapes '
      + '<span class="up-revealable">'
      + '<input checked class="up-hide" id="up-hide-button-3" name="up-revealable-3" type="radio">'
      + '<label for="up-hide-button-3" role="button" tabindex="0">hide</label>'
      + '<input class="up-reveal" id="up-reveal-button-3" name="up-revealable-3" type="radio">'
      + '<label for="up-reveal-button-3" role="button" tabindex="0">reveal</label>'
      + '<span role="alert">usually</span>'
      + '</span>'
      + '</h1>')
  })
})


context('Like outline syntax nodes in the document, table of contents entries render their source line numbers:', () => {
  specify('Level 1 entries', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1, sourceLineNumber: 2
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1 data-up-source-line="2"><a href="#up-topic-1">I enjoy apples</a></h1>')

    expect(documentHtml).to.equal(
      '<h1 data-up-source-line="2" id="up-topic-1">I enjoy apples</h1>')
  })

  specify('Level 7 entries', () => {
    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 7,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1, sourceLineNumber: 13
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<div aria-level="7" data-up-source-line="13" role="heading"><a href="#up-topic-1">I enjoy apples</a></div>')

    expect(documentHtml).to.equal(
      '<div aria-level="7" data-up-source-line="13" id="up-topic-1" role="heading">I enjoy apples</div>')
  })
})


context('When a section link node is associated with an entry', () => {
  specify("it produces a link to the actual entry in the document. The link's contents are the same as the entry's contents within the table of contents itself", () => {
    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 2
      })

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
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">I drink soda</a></h1>'
      + '<h1><a href="#up-topic-2">I never lie</a></h1>')

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
