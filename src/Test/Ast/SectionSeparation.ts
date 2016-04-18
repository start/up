
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
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('Between paragraphs', () => {
  it('3 or more blank lines produces a section separator node', () => {
    const text = `Hello, world!



Goodbye, world!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new SectionSeparatorNode(),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('6 or more blank lines produces only a single section separator node', () => {
    const text = `Hello, world!
 \t






Goodbye, world!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new SectionSeparatorNode(),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')])
      ]))
  })
})


describe('A document that starts with 3 blank lines', () => {
  it('does not produce a leading section separator node', () => {
    const text =
      `


Hello, world!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ])
      ])
    )
  })
})


describe('A document that ends with 3 blank lines', () => {
  it('does not produce a trailing section separator node', () => {
    const text =
      `Hello, world!



`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ])
      ])
    )
  })
})


describe('A line consisting solely of # = - + ~ * ^ @ : _', () => {
  it('produces a section separator node', () => {
    const text = '#=-+~*^@:_+**###=~=~=~--~~~~'

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('A section separator streak', () => {
  it('can be directly followed by a paragraph', () => {
    const text = `
~-~-~-~-~
60.4%`
    expect(Up.toAst(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('60.4%')
        ])
      ]))
  })
  
  it('can have whitespace interspersed throughout the line in any manner', () => {
    const text = '+**###=~=~=~   --~~~~ # =   - +    ~ * ^\t @ :_'
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can contain as few as 3 non-whitespace characters', () => {
    const text = '= - ~'
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can be surrounded by any number of blank lines and still produce a single separator node', () => {
    const text = `
Hello.




===




Goodbye.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello.')
        ]),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('Goodbye.')
        ]),
      ]))
  })
})


describe('Consecutive separator streaks', () => {
  it('produce a single section separator node', () => {
    const text = `
=============================================
#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
=============================================`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('Section separator streaks with blank lines in between', () => {
  it('produce a single section separator node', () => {
    const text = `
--------

########





--------
`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})
