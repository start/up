import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'


// TODO: Flatten contexts 
context('When a document has a table of contents, its first HTML element is <nav class="up-table-of-contents">. The <nav> starts with an <h1> containing the term for "Table of Contents".', () => {
  context("Following the <h1> is an <ul> containing a <li> for each entry in the table of contents. Each <li> contains a link to the appropriate element in the document.", () => {
    context("For heading entries, the link's content is the heading's content, and the link is placed inside a new heading element 1 level higher than the original heading.", () => {
      specify('A level 1 heading entry is placed in an <h2>', () => {
        const heading =
          new Heading([new PlainText('I enjoy apples')], 1)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
          + '</ul>'
          + '</nav>'
          + '<h1 id="up-item-1">I enjoy apples</h1>')
      })

      specify('A level 2 heading entry is placed in an <h3>', () => {
        const heading =
          new Heading([new PlainText('I enjoy apples')], 2)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h3><a href="#up-item-1">I enjoy apples</a></h3></li>'
          + '</ul>'
          + '</nav>'
          + '<h2 id="up-item-1">I enjoy apples</h2>')
      })

      specify('A level 3 heading entry is placed in an <h4>', () => {
        const heading =
          new Heading([new PlainText('I enjoy apples')], 3)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h4><a href="#up-item-1">I enjoy apples</a></h4></li>'
          + '</ul>'
          + '</nav>'
          + '<h3 id="up-item-1">I enjoy apples</h3>')
      })

      specify('A level 4 heading entry entry contains an <h5>', () => {
        const heading =
          new Heading([new PlainText('I enjoy apples')], 4)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h5><a href="#up-item-1">I enjoy apples</a></h5></li>'
          + '</ul>'
          + '</nav>'
          + '<h4 id="up-item-1">I enjoy apples</h4>')
      })

      specify('A level 5 heading entry is placed in an <h6>', () => {
        const heading =
          new Heading([new PlainText('I enjoy apples')], 5)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h6><a href="#up-item-1">I enjoy apples</a></h6></li>'
          + '</ul>'
          + '</nav>'
          + '<h5 id="up-item-1">I enjoy apples</h5>')
      })

      context("HTML heading levels don't go higher than <h6>, so all subsequent heading levels produce <h6> table of contents entries.", () => {
        specify('A level 6 heading entry is placed in an <h6>', () => {
          const heading =
            new Heading([new PlainText('I enjoy apples')], 6)

          const document =
            new UpDocument([heading], new UpDocument.TableOfContents([heading]))

          expect(Up.toHtml(document)).to.be.eql(
            '<nav class="up-table-of-contents">'
            + '<h1>Table of Contents</h1>'
            + '<ul>'
            + '<li><h6><a href="#up-item-1">I enjoy apples</a></h6></li>'
            + '</ul>'
            + '</nav>'
            + '<h6 id="up-item-1">I enjoy apples</h6>')
        })

        specify('A level 10 heading entry is placed in an <h6>', () => {
          const heading =
            new Heading([new PlainText('I enjoy apples')], 6)

          const document =
            new UpDocument([heading], new UpDocument.TableOfContents([heading]))

          expect(Up.toHtml(document)).to.be.eql(
            '<nav class="up-table-of-contents">'
            + '<h1>Table of Contents</h1>'
            + '<ul>'
            + '<li><h6><a href="#up-item-1">I enjoy apples</a></h6></li>'
            + '</ul>'
            + '</nav>'
            + '<h6 id="up-item-1">I enjoy apples</h6>')
        })
      })
    })
  })

  context("The table of contents has no effect on elements that aren't referenced by it", () => {
    specify("even when syntax nodes represented by those elements are otherwise identical", () => {
      const headingInTableOfContents =
        new Heading([new PlainText('I enjoy apples')], 1)

      const document =
        new UpDocument([
          headingInTableOfContents,
          new Blockquote([
            new Heading([new PlainText('I enjoy apples')], 1)
          ])
        ], new UpDocument.TableOfContents([headingInTableOfContents]))

      expect(Up.toHtml(document)).to.be.eql(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>'
        + '<h1 id="up-item-1">I enjoy apples</h1>'
        + '<blockquote>'
        + '<h1>I enjoy apples</h1>'
        + '</blockquote>')
    })
  })
})
