import { expect } from 'chai'
import * as Up from '../../Up'


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
          keywords: { revealable: 'LOOK AWAY' }
        }
      })

      expect(html).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-revealable" data-up-source-line="7">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
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
        + '<div class="up-revealable">'
        + '<input checked class="up-hide" id="article-hide-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="article-reveal-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-reveal-button-1" role="button" tabindex="0">reveal</label>'
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
          keywords: { revealable: 'LOOK AWAY' }
        },
        rendering: {
          idPrefix: 'article'
        }
      })

      expect(html).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="article-topic-1">I enjoy apples</h1>'
        + '<div class="up-revealable" data-up-source-line="7">'
        + '<input checked class="up-hide" id="article-hide-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="article-reveal-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-reveal-button-1" role="button" tabindex="0">reveal</label>'
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
        + '<div class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
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
            keywords: { revealable: 'LOOK AWAY' }
          }
        })

      expect(tableOfContentsHtml).to.equal(
        '<h1 data-up-source-line="4"><a href="#up-topic-1">I enjoy apples</a></h1>')

      expect(documentHtml).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-revealable" data-up-source-line="7">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
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
            idPrefix: 'article'
          }
        })

      expect(tableOfContentsHtml).to.equal(
        '<h1><a href="#article-topic-1">I enjoy apples</a></h1>')

      expect(documentHtml).to.equal(
        '<p>Anyway, let us get to the point.</p>'
        + '<h1 id="article-topic-1">I enjoy apples</h1>'
        + '<div class="up-revealable">'
        + '<input checked class="up-hide" id="article-hide-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="article-reveal-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-reveal-button-1" role="button" tabindex="0">reveal</label>'
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
            keywords: { revealable: 'LOOK AWAY' }
          },
          rendering: {
            idPrefix: 'article'
          }
        })

      expect(tableOfContentsHtml).to.equal(
        '<h1 data-up-source-line="4"><a href="#article-topic-1">I enjoy apples</a></h1>')

      expect(documentHtml).to.equal(
        '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
        + '<h1 data-up-source-line="4" id="article-topic-1">I enjoy apples</h1>'
        + '<div class="up-revealable" data-up-source-line="7">'
        + '<input checked class="up-hide" id="article-hide-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="article-reveal-button-1" name="article-revealable-1" type="radio">'
        + '<label for="article-reveal-button-1" role="button" tabindex="0">reveal</label>'
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

      const { tableOfContentsHtml, documentHtml } =
        Up.parseAndRenderDocumentAndTableOfContents(markup)

      expect(tableOfContentsHtml).to.equal(
        '<h1><a href="#up-topic-1">I enjoy apples</a></h1>')

      expect(documentHtml).to.equal(
        '<p>Anyway, let us get to the point.</p>'
        + '<h1 id="up-topic-1">I enjoy apples</h1>'
        + '<div class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
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
          keywords: { revealable: 'LOOK AWAY' }
        }
      })

      expect(html).to.equal(
        'After beating the Elite Four, '
        + '<span class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
        + '<span role="alert">Blue steals a Red Delicious from Red.</span>'
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
        + '<span class="up-revealable">'
        + '<input checked class="up-hide" id="reply-104-hide-button-1" name="reply-104-revealable-1" type="radio">'
        + '<label for="reply-104-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="reply-104-reveal-button-1" name="reply-104-revealable-1" type="radio">'
        + '<label for="reply-104-reveal-button-1" role="button" tabindex="0">reveal</label>'
        + '<span role="alert">Blue steals a Red Delicious from Red.</span>'
        + '</span>')
    })

    specify('can be used with both parsing and rendering settings together', () => {
      const markup = `After beating the Elite Four, [LOOK AWAY: Blue steals a Red Delicious from Red.]`

      const html = Up.parseAndRenderInline(markup, {
        parsing: {
          keywords: { revealable: 'LOOK AWAY' }
        },
        rendering: {
          idPrefix: 'reply 104'
        }
      })

      expect(html).to.equal(
        'After beating the Elite Four, '
        + '<span class="up-revealable">'
        + '<input checked class="up-hide" id="reply-104-hide-button-1" name="reply-104-revealable-1" type="radio">'
        + '<label for="reply-104-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="reply-104-reveal-button-1" name="reply-104-revealable-1" type="radio">'
        + '<label for="reply-104-reveal-button-1" role="button" tabindex="0">reveal</label>'
        + '<span role="alert">Blue steals a Red Delicious from Red.</span>'
        + '</span>')
    })

    specify('can be used without settings', () => {
      const markup = `After beating the Elite Four, [SPOILER: Blue steals a Red Delicious from Red.]`

      expect(Up.parseAndRenderInline(markup)).to.equal(
        'After beating the Elite Four, '
        + '<span class="up-revealable">'
        + '<input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-hide-button-1" role="button" tabindex="0">hide</label>'
        + '<input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">'
        + '<label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>'
        + '<span role="alert">Blue steals a Red Delicious from Red.</span>'
        + '</span>')
    })
  })
})
