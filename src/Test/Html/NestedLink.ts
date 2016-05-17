import { expect } from 'chai'
import Up from '../../index'

import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HtmlWriter } from '../../Writer/HtmlWriter'


describe('Inside a link, a footnote', () => {
  it("'does not produce an anchor element. The footnote's sup element directly includes the would-be anchor's contents", () => {
    const node = new LinkNode([
      new PlainTextNode('Google'),
      new FootnoteNode([new PlainTextNode('A really old search engine.')], 2)
    ], 'https://google.com')
    expect(Up.toHtml(node)).to.be.eql('<a href="https://google.com">Google<sup id="footnote-reference-2" data-footnote-reference>2</sup></a>')
  })
})


describe('Inside a link, another link', () => {
  it("'does not produce an anchor element. The would-be anchor's contents are included directly inside the outer link", () => {
    const node = new LinkNode([
      new PlainTextNode('Google is probably not '),
      new LinkNode([new PlainTextNode('Bing')], 'https://bing.com')
    ], 'https://google.com')
    expect(Up.toHtml(node)).to.be.eql('<a href="https://google.com">Google is probably not Bing</a>')
  })
})