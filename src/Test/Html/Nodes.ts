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
    const node = new ParagraphNode([new PlainTextNode('Nimble navigator')])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<p>Nimble navigator</p>')
  })
})

describe('A bulleted list node with list item nodes', () => {
  it('produces a ul element with li elements for each list item', () => {
    const node = new BulletedListNode([
      new BulletedListItemNode([
        new PlainTextNode('Tropical')
      ]),
      new BulletedListItemNode([
        new PlainTextNode('Territories')
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<ul><li>Tropical</li><li>Territories</li></ul>')
  })
})

describe('A line block node with line nodes', () => {
  it('produces no outer element and a div element for each node', () => {
    const node = new LineBlockNode([
      new LineNode([
        new PlainTextNode('Hollow')
      ]),
      new LineNode([
        new PlainTextNode('Fangs')
      ])
    ])
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<div>Hollow</div><div>Fangs</div>')
  })
})

describe('A code block node', () => {
  it('produces a pre element containing a code element', () => {
    const node = new CodeBlockNode('color = Color.Green')
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<pre><code>color = Color.Green</code></pre>')
  })
})

describe('A level 1 heading node', () => {
  it('produces an h1 element', () => {
    const node = new HeadingNode([new PlainTextNode('Bulbasaur')], 1)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h1>Bulbasaur</h1>')
  })
})

describe('A level 2 heading node', () => {
  it('produces an h2 element', () => {
    const node = new HeadingNode([new PlainTextNode('Ivysaur')], 2)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h2>Ivysaur</h2>')
  })
})

describe('A level 3 heading node', () => {
  it('produces an h3 element', () => {
    const node = new HeadingNode([new PlainTextNode('Venusaur')], 3)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h3>Venusaur</h3>')
  })
})

describe('A level 4 heading node', () => {
  it('produces an h4 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charmander')], 4)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h4>Charmander</h4>')
  })
})

describe('A level 5 heading node', () => {
  it('produces an h5 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charmeleon')], 5)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h5>Charmeleon</h5>')
  })
})

describe('A level 6 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Charizard')], 6)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Charizard</h6>')
  })
})

describe('A level 7 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Squirtle')], 7)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Squirtle</h6>')
  })
})

describe('A level 8 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Wartortle')], 8)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Wartortle</h6>')
  })
})

describe('A level 9 heading node', () => {
  it('produces an h6 element', () => {
    const node = new HeadingNode([new PlainTextNode('Blastoise')], 9)
    expect(Up.htmlFromSyntaxNode(node)).to.be.eql('<h6>Blastoise</h6>')
  })
})