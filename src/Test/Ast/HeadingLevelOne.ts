import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'


describe("The first line in a document underlined by any combination or arrangement of: # = - + ~ * ^ @ : _", () => {
  it('always produces a level-1 heading node', () => {
    const markup = `
Hello, world!
#=-+~*^@:_+**###=~=~=~--~~~~`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
})


describe("An underline", () => {
  it('can have whitespace interspersed throughout the underline in any manner', () => {
    const markup = `
Hello, world!
+**###=~=~=~   --~~~~ # =   - +    ~ * ^\t @ :_`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can use as few as 1 one of those characters in its underline', () => {
    const markup = `
Hello, world!
~~~~~~~~~~~~`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
})


describe("A heading", () => {
  it('can have an optional overline consisting of the same characters as its underline', () => {
    const markup = `
#=-+~*^@:_
Hello, world!
#=-+~*^@:_`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('does not need to be the first convention in the document', () => {
    const markup = `
Hello, world!
      
Goodbye, world!
~~~~~~~~~~~~`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
      ]))
  })

  it('can contain inline conventions', () => {
    const markup = `
**Hello**, world!
~~~~~~~~~~~~`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([
          new StressNode([new PlainTextNode('Hello')]),
          new PlainTextNode(', world!'),
        ], 1)
      ]))
  })
})


describe("A heading's optional overline", () => {
  it('must not contain spaces if the underline does not contains spaces', () => {
    const markup = `
- - - - - - -
Hello, world!
-------------`

    expect(Up.toAst(markup)).to.eql(
      new UpDocument([
        new OutlineSeparatorNode(),
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('must contain spaces if the underline contains spaces', () => {
    const markup = `
-------------
Hello, world!
- - - - - - -`

    expect(Up.toAst(markup)).to.eql(
      new UpDocument([
        new OutlineSeparatorNode(),
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('does not need to be the same length as the underline', () => {
    const markup = `
--------
Hello, world!
----------`

    expect(Up.toAst(markup)).to.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have its characters arranged differently than in the underline', () => {
    const markup = `
= - = - = - = - = - = - =
Hello, world!
==  --  ==  --  ==  --  ==`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
})
