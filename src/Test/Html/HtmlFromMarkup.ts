import { expect } from 'chai'
import Up from '../../index'


context("You can produce HTML directly from markup!", () => {
  specify('If you provide the toHtml method with markup, it (internally) calls the toDocument method for you using configuration you provide.', () => {
    const markup = `
Anyway, let us get to the point.

I enjoy apples
==============

LOOK AWAY
  After beating the Elite Four, Blue steals a Red Delicious from Red.`

    const html = Up.toHtml(markup, {
      createTableOfContents: true,
      createSourceMap: true,
      terms: {
        spoiler: 'LOOK AWAY',
        tableOfContents: 'In This Article'
      }
    })

    expect(html).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>In This Article</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<p data-up-source-line="2">Anyway, let us get to the point.</p>'
      + '<h1 data-up-source-line="4" id="up-item-1">I enjoy apples</h1>'
      + '<div class="up-spoiler up-revealable" data-up-source-line="7">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<div>'
      + '<p data-up-source-line="8">After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
      + '</div>'
      + '</div>')
  })

  specify('If you provide the toInlineHtml method with markup, it (internally) calls the toInlineDocument method for you using configuration you provide.', () => {
    const markup = `After beating the Elite Four, [LOOK AWAY: Blue steals a Red Delicious from Red.]`

    const html = Up.toInlineHtml(markup, {
      documentName: 'reply 104',
      terms: {
        spoiler: 'LOOK AWAY',
      }
    })

    expect(html).to.be.eql(
      'After beating the Elite Four, '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="reply-104-spoiler-1">toggle spoiler</label>'
      + '<input id="reply-104-spoiler-1" type="checkbox">'
      + '<span>'
      + '<p data-up-source-line="8">After beating the Elite Four, Blue steals a Red Delicious from Red.</p>'
      + '</span>'
      + '</span>')
  })
})