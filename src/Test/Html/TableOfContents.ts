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


context('A table of contents produces a <nav class="up-table-of-contents"> as the first element of the HTML. The <nav> starts with <h1>Table of Contents</h1>.', () => {
  context("After the <h1>, each table of contents entry gets its own heading element.", () => {
    context("A heading entry produces a heading element 1 level lower than its own. The heading's content is wrapped in a link pointing to the heading in the document.", () => {
      specify('A level 1 heading produces an <h2>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<h2><a href="#up-outline-1">I enjoy apples</a><h2>'
          + '</nav>'
          + '<h1 id="up-outline-1">I enjoy apples</h1>'
        )
      })
    })
  })
})
