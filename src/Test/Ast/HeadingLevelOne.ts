import { expect } from 'chai'
import { Up } from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'


describe('A document\'s first text underlined by any combination or arrangement of # = - + ~ * ^ @ : _', () => {

  it('produces a level-1 heading node', () => {
    const text = `
Hello, world!
#=-+~*^@:_+**###=~=~=~--~~~~`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have whitespace interspersed throughout the underline in any manner', () => {
    const text = `
Hello, world!
+**###=~=~=~   --~~~~ # =   - +    ~ * ^\t @ :_`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can use as few as 1 one of those characters in its underline', () => {
    const text = `
Hello, world!
~~~~~~~~~~~~`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have an optional overline consisting of the same characters as its underline', () => {
    const text = `
#=-+~*^@:_
Hello, world!
#=-+~*^@:_`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('does not need to be the first convention in the document', () => {
    const text = `
Hello, world!
      
Goodbye, world!
~~~~~~~~~~~~`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
      ]))
  })

  it('can contain inline conventions', () => {
    const text = `
**Hello**, world!
~~~~~~~~~~~~`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([
          new StressNode([new PlainTextNode('Hello')]),
          new PlainTextNode(', world!'),
        ], 1)
      ])
    )
  })
})

describe("A heading's optional overline", () => {

  it('must not contain spaces if the underline does not contains spaces', () => {
    const text = `
- - - - - - -
Hello, world!
-------------`
    expect(Up.toAst(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('must contain spaces if the underline does not contains spaces', () => {
    const text = `
-------------
Hello, world!
- - - - - - -`
    expect(Up.toAst(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('does not need to be the same length as the underline', () => {
    const text = `
--------
Hello, world!
----------`
    expect(Up.toAst(text)).to.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have its characters arranged differently than in the underline', () => {
    const text = `
= - = - = - = - = - = - =
Hello, world!
==  --  ==  --  ==  --  ==`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
})
