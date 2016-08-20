import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'


context("Within the table of contents, the IDs of revealable content elements do not clash with those in the document:", () => {
  specify('Inline spoilers', () => {
    const heading =
      new Heading([
        new PlainText('I enjoy apples '),
        new InlineSpoiler([new PlainText('sometimes')])
      ], 1)

    const document =
      new UpDocument([
        new Paragraph([
          new InlineSpoiler([new PlainText('Never')]),
          new PlainText(' eat apples.'),
        ]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><h2><a href="#up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">toggle spoiler</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a></h2></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-2">toggle spoiler</label>'
      + '<input id="up-spoiler-2" role="button" type="checkbox">'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<h1 id="up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-3">toggle spoiler</label>'
      + '<input id="up-spoiler-3" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</h1>')
  })

  specify('Inline NSFW conventions', () => {
    const heading =
      new Heading([
        new PlainText('I enjoy apples '),
        new InlineNsfw([new PlainText('sometimes')])
      ], 1)

    const document =
      new UpDocument([
        new Paragraph([
          new InlineNsfw([new PlainText('Never')]),
          new PlainText(' eat apples.'),
        ]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><h2><a href="#up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">toggle NSFW</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a></h2></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-2">toggle NSFW</label>'
      + '<input id="up-nsfw-2" role="button" type="checkbox">'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<h1 id="up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-3">toggle NSFW</label>'
      + '<input id="up-nsfw-3" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</h1>')
  })

  specify('Inline NSFL conventions', () => {
    const heading =
      new Heading([
        new PlainText('I enjoy apples '),
        new InlineNsfl([new PlainText('sometimes')])
      ], 1)

    const document =
      new UpDocument([
        new Paragraph([
          new InlineNsfl([new PlainText('Never')]),
          new PlainText(' eat apples.'),
        ]),
        heading,
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul><li><h2><a href="#up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">toggle NSFL</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</a></h2></li></ul>'
      + '</nav>'
      + '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-2">toggle NSFL</label>'
      + '<input id="up-nsfl-2" role="button" type="checkbox">'
      + '<span role="alert">Never</span>'
      + '</span>'
      + ' eat apples.'
      + '</p>'
      + '<h1 id="up-item-1">'
      + 'I enjoy apples '
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-3">toggle NSFL</label>'
      + '<input id="up-nsfl-3" role="button" type="checkbox">'
      + '<span role="alert">sometimes</span>'
      + '</span>'
      + '</h1>')
  })
})
