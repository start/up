import { expect } from 'chai'
import * as Up from '../../../Main'


context('Within any attribute value, all instances of " and & are escaped. Specifically, within the', () => {
  specify('src attribute of links', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([], 'https://example.com/?x&y&z="hi"')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;"></a></p>')
  })

  specify('src attribute of audio elements (and of their fallback links)', () => {
    const document = new Up.Document([
      new Up.Audio('Weird', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title="Weird">'
      + '<a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;">Weird</a>'
      + '</audio>')
  })

  specify('src attribute of videos (and of their fallback links)', () => {
    const document = new Up.Document([
      new Up.Video('Weird', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title="Weird">'
      + '<a href="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;">Weird</a>'
      + '</video>')
  })

  specify('src attribute of images', () => {
    const document = new Up.Document([
      new Up.Image('Weird', 'https://example.com/?x&y&z="hi"')
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="Weird" src="https://example.com/?x&amp;y&amp;z=&quot;hi&quot;" title="Weird">')
  })

  specify('title attribute of audio elements', () => {
    const document = new Up.Document([
      new Up.Audio('John said, "1 and 2 > 0. I can\'t believe it."', 'https://example.com/m')
    ])

    expect(Up.render(document)).to.equal(
      '<audio controls src="https://example.com/m" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;">'
      + '<a href="https://example.com/m">John said, "1 and 2 > 0. I can\'t believe it."</a>'
      + '</audio>')
  })

  specify('title attribute of videos', () => {
    const document = new Up.Document([
      new Up.Video('John said, "1 and 2 > 0. I can\'t believe it."', 'https://example.com/m')
    ])

    expect(Up.render(document)).to.equal(
      '<video controls src="https://example.com/m" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;">'
      + '<a href="https://example.com/m">John said, "1 and 2 > 0. I can\'t believe it."</a>'
      + '</video>')
  })

  specify('alt and title attributes of images', () => {
    const document = new Up.Document([
      new Up.Image('John said, "1 and 2 > 0. I can\'t believe it."', 'https://example.com/m')
    ])

    expect(Up.render(document)).to.equal(
      '<img alt="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;" src="https://example.com/m" title="John said, &quot;1 and 2 > 0. I can\'t believe it.&quot;">')
  })

  specify('href attribute of backlinks in footnote blocks', () => {
    const up = new Up.Up({
      rendering: {
        terms: {
          footnoteReference: 'look "up" & read & remember'
        }
      }
    })

    const document = new Up.Document([
      new Up.FootnoteBlock([
        new Up.Footnote([], { referenceNumber: 2 })
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2">'
      + '<a href="#up-look-&quot;up&quot;-&amp;-read-&amp;-remember-2">2</a>'
      + '</dt><dd></dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })

  specify('id attribute of footntoes in a footnote block', () => {
    const up = new Up.Up({
      rendering: {
        terms: {
          footnote: 'look "down" & read & learn'
        }
      }
    })

    const document = new Up.Document([
      new Up.FootnoteBlock([
        new Up.Footnote([], { referenceNumber: 2 })
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-look-&quot;down&quot;-&amp;-read-&amp;-learn-2">'
      + '<a href="#up-footnote-reference-2">2</a>'
      + '</dt><dd></dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })

  specify("href attribute of a footnote reference's link", () => {
    const up = new Up.Up({
      rendering: {
        terms: {
          footnote: 'look "down" & read & learn'
        }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    const html =
      '<p>'
      + '<sup class="up-footnote-reference" id="up-footnote-reference-3">'
      + '<a href="#up-look-&quot;down&quot;-&amp;-read-&amp;-learn-3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.render(document)).to.equal(html)
  })

  specify('id attribute of footnote references', () => {
    const up = new Up.Up({
      rendering: {
        terms: {
          footnoteReference: 'look "up" & read & remember'
        }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    const html =
      '<p>'
      + '<sup class="up-footnote-reference" id="up-look-&quot;up&quot;-&amp;-read-&amp;-remember-3">'
      + '<a href="#up-footnote-3">3</a>'
      + '</sup>'
      + '</p>'

    expect(up.render(document)).to.equal(html)
  })

  specify('the id attribute of elements referenced by the table of contents', () => {
    const up = new Up.Up({
      rendering: {
        terms: {
          sectionReferencedByTableOfContents: 'look "away" & smile & forget'
        }
      }
    })

    const IGNORED_FIELD: string = null!

    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        titleMarkup: IGNORED_FIELD,
        ordinalInTableOfContents: 1
      })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderWithTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-look-&quot;away&quot;-&amp;-smile-&amp;-forget-1">I enjoy apples</a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-look-&quot;away&quot;-&amp;-smile-&amp;-forget-1">I enjoy apples</h1>')
  })
})


describe("Within a link's href attribute, <, ', and >", () => {
  it('are not escaped', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([], "https://example.com/?z='<span>'")
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><a href="https://example.com/?z=\'<span>\'"></a></p>')
  })
})
