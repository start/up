import { expect } from 'chai'
import * as Up from '../../../Main'


describe('Within a text node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p>')
  })
})


describe('Within a text node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Text('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.render(document)).to.equal('<p>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</p>')
  })
})


describe('Within a code block node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.CodeBlock('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
    ])

    expect(Up.render(document)).to.equal('<pre><code>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</code></pre>')
  })
})


describe('Within a code block node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.CodeBlock('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
    ])

    expect(Up.render(document)).to.equal('<pre><code>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</code></pre>')
  })
})


describe('Within an inline code node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineCode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><code class="up-inline-code">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</code></p>')
  })
})


describe('Within an inline code node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineCode('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><code class="up-inline-code">John\'s friend said, "1 and 2 > 0. I can\'t believe it."</code></p>')
  })
})


describe('Within an example user input node, all instances of < and &', () => {
  it('are escaped by replacing them with &lt; and &amp;', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.ExampleUserInput('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><kbd>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</kbd></p>')
  })
})


describe('Within an example user input node, >, \', and "', () => {
  it('are preserved', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.ExampleUserInput('John\'s friend said, "1 and 2 > 0. I can\'t believe it."')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><kbd>John\'s friend said, "1 and 2 > 0. I can\'t believe it."</kbd></p>')
  })
})


context('All instances of < and & are escaped on both buttons rendered for revealable conventions.', () => {
  context('Inline revealables:', () => {
    specify('Hide button', () => {
      const up = new Up.Up({
        rendering: {
          terms: { hide: '<_< & hide & vanish' }
        }
      })

      const document = new Up.Document([
        new Up.Paragraph([
          new Up.InlineRevealable([])
        ])
      ])

      const html =
        '<p>'
        + '<span class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">&lt;_&lt; &amp; hide &amp; vanish</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
        + '<span role="alert"></span>'
        + '</span>'
        + '</p>'

      expect(up.render(document)).to.equal(html)
    })

    specify('Reveal button', () => {
      const up = new Up.Up({
        rendering: {
          terms: { reveal: '<_< & show & see' }
        }
      })

      const document = new Up.Document([
        new Up.Paragraph([
          new Up.InlineRevealable([])
        ])
      ])

      const html =
        '<p>'
        + '<span class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">&lt;_&lt; &amp; show &amp; see</label>'
        + '<span role="alert"></span>'
        + '</span>'
        + '</p>'

      expect(up.render(document)).to.equal(html)
    })
  })


  context('Revealable blocks:', () => {
    specify('Hide button', () => {
      const up = new Up.Up({
        rendering: {
          terms: { hide: '<_< & hide & vanish' }
        }
      })

      const document = new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('John Carmack is a decent programmer.')
          ])
        ])
      ])

      const html =
        '<div class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">&lt;_&lt; &amp; hide &amp; vanish</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
        + '<div role="alert">'
        + '<p>John Carmack is a decent programmer.</p>'
        + '</div>'
        + '</div>'

      expect(up.render(document)).to.equal(html)
    })

    specify('Reveal button', () => {
      const up = new Up.Up({
        rendering: {
          terms: { reveal: '<_< & show & see' }
        }
      })

      const document = new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('John Carmack is a decent programmer.')
          ])
        ])
      ])

      const html =
        '<div class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">&lt;_&lt; &amp; show &amp; see</label>'
        + '<div role="alert">'
        + '<p>John Carmack is a decent programmer.</p>'
        + '</div>'
        + '</div>'

      expect(up.render(document)).to.equal(html)
    })
  })
})


describe('Inside a text node itself nested within several inline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Emphasis([
          new Up.Stress([
            new Up.InlineQuote([
              new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p>'
      + '<em><strong><q>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</q></strong></em>'
      + '</p>')
  })
})


describe('Inside a text node itself nested within several outline nodes, all instances of < and &', () => {
  it('are escaped once', () => {
    const document = new Up.Document([
      new Up.Blockquote([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
            ])
          ])
        ])
      ])
    ])

    expect(Up.render(document)).to.equal('<blockquote><ul><li><p>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</p></li></ul></blockquote>')
  })
})


describe("Within a video's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const document = new Up.Document([
      new Up.Video('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', 'https://example.com/m')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls src="https://example.com/m" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?">'
      + '<a href="https://example.com/m">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a>'
      + '</video>')
  })
})


describe("Within an audio convention's fallback link content, all instances of < and &", () => {
  it("are escaped (but they're not escaped in the audio element's title attribute)", () => {
    const document = new Up.Document([
      new Up.Audio('4 & 5 < 10, and 6 & 7 < 10. Coincidence?', 'https://example.com/m')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls src="https://example.com/m" title="4 &amp; 5 < 10, and 6 &amp; 7 < 10. Coincidence?">'
      + '<a href="https://example.com/m">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a>'
      + '</audio>')
  })
})


context('Within a table of contents entry, all instances of < and & are escaped:', () => {
  const NOT_USED: string = null

  specify('In the table of contents itself', () => {
    const heading =
      new Up.Heading([
        new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ], {
          level: 1,
          titleMarkup: NOT_USED,
          ordinalInTableOfContents: 1
        })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</h1>')
  })

  specify('In a section link referencing that table of contents entry', () => {
    const heading =
      new Up.Heading([
        new Up.Text('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
      ], {
          level: 1,
          titleMarkup: NOT_USED,
          ordinalInTableOfContents: 1
        })

    const document =
      new Up.Document([
        new Up.Paragraph([
          new Up.SectionLink('coincidence', heading)
        ]),
        heading
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</a></p>'
      + '<h1 id="up-topic-1">4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</h1>')
  })
})


context('Within a section link that was never actually associated with an entry', () => {
  specify('all instances of all instances of < and & are escaped', () => {
    const document =
      new Up.Document([
        new Up.Paragraph([
          new Up.SectionLink('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
        ])
      ])

    expect(Up.render(document)).to.equal(
      '<p>'
      + '<i>4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?</i>'
      + '</p>')
  })
})
