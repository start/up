import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'


context("Indentation is important for many outline conventions. However, once the outline convention of a line has been determined, any leading whitespace is often ignored. This is true for:", () => {

  specify('Paragraphs', () => {
    expect(Up.toAst(" \t I'm just a normal guy who eats only when it's raining outside.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I'm just a normal guy who eats only when it's raining outside.")
        ])
      ]))
  })

  specify('Line blocks', () => {
    const text = `
  \t Roses are red
Skeltals are white
 \t  If you stay here
 You're in for a fright`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Skeltals are white')
          ]),
          new Line([
            new PlainTextNode('If you stay here')
          ]),
          new Line([
            new PlainTextNode("You're in for a fright")
          ]),
        ])
      ]))
  })

  specify('Headings', () => {
    const text = `
 \t Hello, world!
~~~~~~~~~~~~`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
})