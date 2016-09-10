import { expect } from 'chai'
import Up from '../../index'


context("You can produce HTML directly from markup!", () => {
  specify('If you provide the render method with markup, it (internally) calls the parse method for you using configuration you provide', () => {
    const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

    const config = {
      parsing: {
        createSourceMap: true,
        terms: { spoiler: 'LOOK AWAY' }
      },
      rendering: {
        terms: { tableOfContents: 'In This Article' }
      }
    }

    expect(Up.parseAndRender(markup, config)).to.equal(
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

  specify('If you provide the renderDocumentAndTableOfContents method with markup, it (internally) calls the parse method for you using configuration you provide', () => {
    const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

    const config = {
      parsing: {
        createSourceMap: true,
        terms: { spoiler: 'LOOK AWAY' }
      },
      rendering: {
        terms: { tableOfContents: 'In This Article' }
      }
    }

    const { tableOfContentsHtml, documentHtml } =
      Up.parseAndRenderDocumentAndTableOfContents(markup, config)

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
