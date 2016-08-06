import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { TableNode } from '../../SyntaxNodes/TableNode'

/*import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'*/


context('When a document has table of contents, it produces a <nav class="up-table-of-contents"> as the first element of the HTML. The <nav> starts with an <h1> containing the term for "Table of Contents"', () => {
  context("After that <h1> is an <ul> in which each table of contents entry gets its own item.", () => {
    context("A heading entry produces a heading element with a level one higher than its own. The heading's content is wrapped in a link pointing to the actual heading in the document.", () => {
      specify('A level 1 heading produces an <h2>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h2><a href="#up-outline-1">I enjoy apples</a></h2></li>'
          + '</ul>'
          + '</nav>'
          + '<h1 id="up-outline-1">I enjoy apples</h1>')
      })

      specify('A level 2 heading produces an <h3>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 2)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h3><a href="#up-outline-1">I enjoy apples</a></h3></li>'
          + '</ul>'
          + '</nav>'
          + '<h2 id="up-outline-1">I enjoy apples</h2>')
      })

      specify('A level 3 heading produces an <h4>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 3)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h4><a href="#up-outline-1">I enjoy apples</a></h4></li>'
          + '</ul>'
          + '</nav>'
          + '<h3 id="up-outline-1">I enjoy apples</h3>')
      })

      specify('A level 4 heading produces an <h5>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 4)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h5><a href="#up-outline-1">I enjoy apples</a></h5></li>'
          + '</ul>'
          + '</nav>'
          + '<h4 id="up-outline-1">I enjoy apples</h4>')
      })

      specify('A level 5 heading produces an <h6>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 5)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h6><a href="#up-outline-1">I enjoy apples</a></h6></li>'
          + '</ul>'
          + '</nav>'
          + '<h5 id="up-outline-1">I enjoy apples</h5>')
      })

      context('HTML heading levels go no higher than <h6>, so all subsequent heading levels produce <h6> table of contents entries.', () => {
        specify('A level 6 heading produces an <h6>', () => {
          const heading =
            new HeadingNode([new PlainTextNode('I enjoy apples')], 6)

          const documentNode =
            new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

          expect(Up.toHtml(documentNode)).to.be.eql(
            '<nav class="up-table-of-contents">'
            + '<h1>Table of Contents</h1>'
            + '<ul>'
            + '<li><h6><a href="#up-outline-1">I enjoy apples</a></h6></li>'
            + '</ul>'
            + '</nav>'
            + '<h6 id="up-outline-1">I enjoy apples</h6>')
        })

        specify('A level 10 heading produces an <h6>', () => {
          const heading =
            new HeadingNode([new PlainTextNode('I enjoy apples')], 6)

          const documentNode =
            new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

          expect(Up.toHtml(documentNode)).to.be.eql(
            '<nav class="up-table-of-contents">'
            + '<h1>Table of Contents</h1>'
            + '<ul>'
            + '<li><h6><a href="#up-outline-1">I enjoy apples</a></h6></li>'
            + '</ul>'
            + '</nav>'
            + '<h6 id="up-outline-1">I enjoy apples</h6>')
        })
      })
    })

    context('Charts and tables (both of which must have a caption to be included in the table of contents) each produce a link element containing their caption.', () => {
      specify('A table produces a link containing its caption', () => {
        const table =
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([new PlainTextNode('Game')]),
              new TableNode.Header.Cell([new PlainTextNode('Developer')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
                new TableNode.Row.Cell([new PlainTextNode('Square')])
              ]),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Super Mario Kart')]),
                new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
              ])
            ],
            new TableNode.Caption([
              new PlainTextNode('Influential games')
            ]))

        const documentNode =
          new DocumentNode([table], new DocumentNode.TableOfContents([table]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><a href="#up-outline-1">Influential games</a></li>'
          + '</ul>'
          + '</nav>'
          + '<table id="up-outline-1">'
          + '<caption>Influential games</caption>'
          + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
          + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
          + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
          + '</table>')
      })

      specify('A chart produces a link containing its caption', () => {
        const table =
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('1')]),
              new TableNode.Header.Cell([new PlainTextNode('0')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('true')]),
                new TableNode.Row.Cell([new PlainTextNode('false')]),
              ], new TableNode.Header.Cell([new PlainTextNode('1')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('false')]),
                new TableNode.Row.Cell([new PlainTextNode('false')])
              ], new TableNode.Header.Cell([new PlainTextNode('0')]))
            ],
            new TableNode.Caption([new PlainTextNode('AND operator logic')]))

        const documentNode =
          new DocumentNode([table], new DocumentNode.TableOfContents([table]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><a href="#up-outline-1">AND operator logic</a></li>'
          + '</ul>'
          + '</nav>'
          + '<table id="up-outline-1">'
          + '<caption>AND operator logic</caption>'
          + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
          + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
          + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
          + '</table>')
      })
    })
  })
})
