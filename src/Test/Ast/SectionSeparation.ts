import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


context('Between paragraphs', () => {
  specify('3 or more empty or blank lines produces a section separator node', () => {
    const markup = `
Hello, world!
  \t \t
  \t \t

Goodbye, world!`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ]),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('Goodbye, world!')
        ]),
      ]))
  })

  specify('6 or more empty or blank lines produces only a single section separator node', () => {
    const markup = `
Hello, world!

 \t

 \t


 \t
Goodbye, world!`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ]),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('Goodbye, world!')
        ])
      ]))
  })
})


describe('A document that starts with 3 or more empty or blank lines', () => {
  it('does not produce a leading section separator node', () => {
    const markup = `



\t
 \t
\t
Hello, world!`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ])
      ]))
  })
})


describe('A document that ends with 3 or more empty or blank lines', () => {
  it('does not produce a trailing section separator node', () => {
    const markup = `
Hello, world!



\t
 \t
\t
`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ])
      ]))
  })
})


describe('A line consisting solely of any combination of # = - + ~ * ^ @ : _', () => {
  it('produces a section separator node', () => {
    const markup = '#=-+~*^@:_+**###=~=~=~--~~~~'

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('A section separator streak', () => {
  it('can be directly followed by a paragraph', () => {
    const markup = `
~-~-~-~-~
60.4%`

    expect(Up.toAst(markup)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('60.4%')
        ])
      ]))
  })

  it('can have whitespace interspersed throughout the line in any manner', () => {
    const markup = '+**###=~=~=~   --~~~~ # =   - +    ~ * ^\t @ :_'

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can contain as few as 3 non-whitespace characters', () => {
    expect(Up.toAst('= - ~')).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can be surrounded by any number of empty or blank lines and still produce a single separator node', () => {
    const markup = `
Hello.
 \t \t



===




Goodbye.`
    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
=============================================
#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
=============================================`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


context('When section separator streaks are separated from each other by only blank or empty lines, they produce only a single section separator node. This applies when they are separated by:', () => {
  specify('1 or 2 blank or empty lines', () => {
    const markup = `
--------

########
 \t

--------`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  specify('3 or more blank or empty lines', () => {
    const markup = `
--------

  \t
 \t
  \t
########
 



--------`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})
