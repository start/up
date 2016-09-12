import { expect } from 'chai'
import { Up } from '../../Up'


context("You can render HTML directly from markup.", () => {
  context('The parseAndRender method', () => {
    specify('can be used with parsing settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const html = Up.parseAndRender(markup, {
        parsing: {
          createSourceMap: true,
          terms: { spoiler: 'LOOK AWAY' }
        }
      })

      expect(html).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable" data-up-source-line="7">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p data-up-source-line="8">After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })

    specify('can be used with rendering settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

SPOILER
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const html = Up.parseAndRender(markup, {
        rendering: {
          idPrefix: 'article'
        }
      })

      expect(html).to.equal(
        '<p>Anyway, let us get to the point.</p>'
        + '<h1 id="article-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable">'
        + '<label for="article-spoiler-1">toggle spoiler</label>'
        + '<input id="article-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p>After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })

    specify('can be used with parsing and rendering settings together', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const html = Up.parseAndRender(markup, {
        parsing: {
          createSourceMap: true,
          terms: { spoiler: 'LOOK AWAY' }
        },
        rendering: {
          idPrefix: 'article'
        }
      })

      expect(html).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="article-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable" data-up-source-line="7">'
        + '<label for="article-spoiler-1">toggle spoiler</label>'
        + '<input id="article-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p data-up-source-line="8">After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })

    specify('can be used without settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

SPOILER
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      expect(Up.parseAndRender(markup)).to.equal(
        '<p>Anyway, let us get to the point.</p>'
        + '<h1 id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p>After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })
  })

  context('The parseAndRenderDocumentAndTableOfContents method', () => {
    specify('can be used with parsing settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const { tableOfContentsHtml, documentHtml } =
        Up.parseAndRenderDocumentAndTableOfContents(markup, {
          parsing: {
            createSourceMap: true,
            terms: { spoiler: 'LOOK AWAY' }
          }
        })

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable" data-up-source-line="7">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p data-up-source-line="8">After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })

    specify('can be used with rendering settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

SPOILER
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const { tableOfContentsHtml, documentHtml } =
        Up.parseAndRenderDocumentAndTableOfContents(markup, {
          rendering: {
            terms: { tableOfContents: 'In This Article' }
          }
        })

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>In This Article</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<p>Anyway, let us get to the point.</p>'
        + '<h1 id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p>After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })

    specify('can be used with both parsing and rendering settings together', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const { tableOfContentsHtml, documentHtml } =
        Up.parseAndRenderDocumentAndTableOfContents(markup, {
          parsing: {
            createSourceMap: true,
            terms: { spoiler: 'LOOK AWAY' }
          },
          rendering: {
            terms: { tableOfContents: 'In This Article' }
          }
        })

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>In This Article</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable" data-up-source-line="7">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p data-up-source-line="8">After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })

    specify('can be used witout settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

SPOILER
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const { tableOfContentsHtml, documentHtml } =
        Up.parseAndRenderDocumentAndTableOfContents(markup)

      expect(tableOfContentsHtml).to.equal(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>')

      expect(documentHtml).to.equal(
        '<p>Anyway, let us get to the point.</p>'
        + '<h1 id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-spoiler up-revealable">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<div role="alert">'
        + '<p>After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
        + '</div>'
        + '</div>')
    })
  })

  context('The parseAndRenderInline method', () => {
    specify('can be used with parsing settings', () => {
      const markup = `After beating the Elite Four, [LOOK AWAY: Blue steals a Red Delicious from Red.]`

      const html = Up.parseAndRenderInline(markup, {
        parsing: {
          terms: { spoiler: 'LOOK AWAY' }
        }
      })

      expect(html).to.equal(
        'After beating the Elite Four, '
        + '<span class="up-spoiler up-revealable">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<span role="alert">'
        + 'Blue steals a Red Delicious from Red.'
        + '</span>'
        + '</span>')
    })

    specify('can be used with rendering settings', () => {
      const markup = `After beating the Elite Four, [SPOILER: Blue steals a Red Delicious from Red.]`

      const html = Up.parseAndRenderInline(markup, {
        rendering: {
          idPrefix: 'reply 104'
        }
      })

      expect(html).to.equal(
        'After beating the Elite Four, '
        + '<span class="up-spoiler up-revealable">'
        + '<label for="reply-104-spoiler-1">toggle spoiler</label>'
        + '<input id="reply-104-spoiler-1" role="button" type="checkbox">'
        + '<span role="alert">'
        + 'Blue steals a Red Delicious from Red.'
        + '</span>'
        + '</span>')
    })

    specify('can be used with both parsing and rendering settings together', () => {
      const markup = `After beating the Elite Four, [LOOK AWAY: Blue steals a Red Delicious from Red.]`

      const html = Up.parseAndRenderInline(markup, {
        parsing: {
          terms: { spoiler: 'LOOK AWAY' }
        },
        rendering: {
          idPrefix: 'reply 104'
        }
      })

      expect(html).to.equal(
        'After beating the Elite Four, '
        + '<span class="up-spoiler up-revealable">'
        + '<label for="reply-104-spoiler-1">toggle spoiler</label>'
        + '<input id="reply-104-spoiler-1" role="button" type="checkbox">'
        + '<span role="alert">'
        + 'Blue steals a Red Delicious from Red.'
        + '</span>'
        + '</span>')
    })

    specify('can be used without settings', () => {
      const markup = `After beating the Elite Four, [SPOILER: Blue steals a Red Delicious from Red.]`

      expect(Up.parseAndRenderInline(markup)).to.equal(
        'After beating the Elite Four, '
        + '<span class="up-spoiler up-revealable">'
        + '<label for="up-spoiler-1">toggle spoiler</label>'
        + '<input id="up-spoiler-1" role="button" type="checkbox">'
        + '<span role="alert">'
        + 'Blue steals a Red Delicious from Red.'
        + '</span>'
        + '</span>')
    })
  })
})