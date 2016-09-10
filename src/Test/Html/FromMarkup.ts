import { expect } from 'chai'
import Up from '../../index'


context("You can render HTML directly from markup.", () => {
  describe('The parseAndRenderMathod', () => {
    specify('Can be used with settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const settings = {
        parsing: {
          createSourceMap: true,
          terms: { spoiler: 'LOOK AWAY' }
        },
        rendering: {
          idPrefix: 'article'
        }
      }

      expect(Up.parseAndRender(markup, settings)).to.equal(
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

    specify('Can be used without settings', () => {
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

  context('The parseAndRenderDocumentAndTableOfContents', () => {
    specify('Can be used with settings', () => {
      const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

      const settings = {
        parsing: {
          createSourceMap: true,
          terms: { spoiler: 'LOOK AWAY' }
        },
        rendering: {
          terms: { tableOfContents: 'In This Article' }
        }
      }

      const { tableOfContentsHtml, documentHtml } =
        Up.parseAndRenderDocumentAndTableOfContents(markup, settings)

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

    specify('Can be used witout settings', () => {
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
  })

  specify('If you provide the renderInline method with markup, it (internally) calls the parseInline method for you using configuration you provide', () => {
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
})
