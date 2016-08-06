import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'

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
import { TableNode } from '../../SyntaxNodes/TableNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'*/


context('A table of contents produces a <nav class="up-table-of-contents"> as the first element of the HTML. The <nav> starts with an <h1> containing the term for "Table of Contents"', () => {
  context("After that <h1>, each table of contents entry gets its own HTML element.", () => {
    context("A heading entry produces a heading element with a level one higher than its own. The heading's content is wrapped in a link pointing to the actual heading in the document.", () => {
      specify('A level 1 heading produces an <h2>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<h2><a href="#up-outline-1">I enjoy apples</a></h2>'
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
          + '<h3><a href="#up-outline-1">I enjoy apples</a></h3>'
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
          + '<h4><a href="#up-outline-1">I enjoy apples</a></h4>'
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
          + '<h5><a href="#up-outline-1">I enjoy apples</a></h5>'
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
          + '<h6><a href="#up-outline-1">I enjoy apples</a></h6>'
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
            + '<h6><a href="#up-outline-1">I enjoy apples</a></h6>'
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
            + '<h6><a href="#up-outline-1">I enjoy apples</a></h6>'
            + '</nav>'
            + '<h6 id="up-outline-1">I enjoy apples</h6>')
        })
      })
    })
  })
})
