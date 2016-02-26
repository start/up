/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
 
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode' 
import { TextSyntaxNode } from '../../SyntaxNodes/TextSyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { BulletedListNode } from '../../SyntaxNodes/BulletedListNode'
import { BulletedListItemNode } from '../../SyntaxNodes/BulletedListItemNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import * as Up from '../../index'

describe('An empty document node', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.htmlFromSyntaxNode(new DocumentNode())).to.be.eql('')
  })
})

describe('A paragraph node', () => {
  it('produces a p element', () => {
    const node = new ParagraphNode([new PlainTextNode('Hello.')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<p>Hello.</p>')
  })
})

describe('A bulleted list node with list item nodes', () => {
  it('produces a ul element with li elements for each list item', () => {
    const node = new BulletedListNode([
      new BulletedListItemNode([
        new PlainTextNode('Hello')
      ]),
      new BulletedListItemNode([
        new PlainTextNode('Goodbye')
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<ul><li>Hello</li><li>Goodbye</li></ul>')
  })
})

describe('A line block node with line nodes', () => {
  it('produces no outer element and a div element for each node', () => {
    const node = new LineBlockNode([
      new LineNode([
        new PlainTextNode('Hello')
      ]),
      new LineNode([
        new PlainTextNode('Goodbye')
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<div>Hello</div><div>Goodbye</div>')
  })
})