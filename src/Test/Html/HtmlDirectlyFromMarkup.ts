import { expect } from 'chai'
import Up from '../../index'


context("You can produce HTML directly from markup!", () => {
  specify('If you provide the renderHtml method with markup, it (internally) calls the parseDocument method for you using configuration you provide', () => {
    const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

    const config = {
      createSourceMap: true,
      terms: {
        markup: { spoiler: 'LOOK AWAY' },
        output: { tableOfContents: 'In This Article' }
      }
    }

    expect(Up.renderHtml(markup, config)).to.equal(
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

  specify('If you provide the renderHtmlForDocumentAndTableOfContents method with markup, it (internally) calls the parseDocument method for you using configuration you provide', () => {
    const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

    const config = {
      createSourceMap: true,
      terms: {
        markup: { spoiler: 'LOOK AWAY' },
        output: { tableOfContents: 'In This Article' }
      }
    }

    const result = Up.renderHtmlForDocumentAndTableOfContents(markup, config)

    expect(result.tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>In This Article</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(result.documentHtml).to.equal(
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

  specify('If you provide the renderInlineHtml method with markup, it (internally) calls the parseInlineDocument method for you using configuration you provide', () => {
    const markup = `After beating the Elite Four, [LOOK AWAY: Blue steals a Red Delicious from Red.]`

    const html = Up.renderInlineHtml(markup, {
      idPrefix: 'reply 104',
      terms: {
        markup: { spoiler: 'LOOK AWAY' }
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
