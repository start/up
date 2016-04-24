
import { expect } from 'chai'
import * as Up from '../../index'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'


describe('Consecutive non-blank lines', () => {
  it('produce a line block node containing line nodes', () => {
    const text =
      `
Roses are red
Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})


describe('A section separator streak', () => {
  it('can separate two line blocks', () => {
    const text =
      `
Roses are red
Violets are blue
#~#~#~#~#~#~#~#~#~#~#~#~#~#
Lyrics have lines
And addresses do, too`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
        new SectionSeparatorNode(),
        new LineBlockNode([
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
})


describe('Lines in a line block', () => {
  it('can contain inline conventions', () => {
    const text =
      `
Roses are red
Violets are **blue**
Lyrics have lines
And addresses do, too
`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are '),
            new StressNode([
              new PlainTextNode('blue')
            ])
          ]),
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
  
  it('can be blank if escaped', () => {
    const text =
      `
Roses are red
\\ \t
\\ \t
Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode(' \t')
          ]),
          new Line([
            new PlainTextNode(' \t')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
  
  it('can contain an escaped section separator streak', () => {
    const text =
      `
Roses are red
Violets are blue
\\#~#~#~#~#~#~#~#~#
Lyrics have lines
And addresses do, too`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
          new Line([
            new PlainTextNode('#~#~#~#~#~#~#~#~#')
          ]),
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
})
