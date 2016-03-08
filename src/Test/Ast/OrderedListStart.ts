/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
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
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItemNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'

function listStart(text: string): number {
  const list = <OrderedListNode>Up.ast(text).children[0]
  return list.start()
}

describe('An ordered list that does not start with a numeral bullet', () => {
  it('does not have an explicit starting ordinal', () => {
    const text =
      `
#. Hello, world!
# Goodbye, world!
#) Goodbye, world!`
    expect(listStart(text)).to.be.eql(null)
  })

  it('does not have an explicit starting ordinal even if the second list item has a numeral bullet', () => {
    const text =
      `
#. Hello, world!
5 Goodbye, world!
#) Goodbye, world!`
    expect(listStart(text)).to.be.eql(null)
  })
})


describe('An ordered list that starts with a numeral bullet', () => {
  it('has an explicit starting ordinal equal to the numeral value', () => {
    const text =
      `
10) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`
    expect(listStart(text)).to.be.eql(10)
  })
})