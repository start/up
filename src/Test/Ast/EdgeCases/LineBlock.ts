/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'


describe('A line starting with an escaped character in a line block', () => {
  it('does not impact the parsing of the next line', () => {
    const text =
      `
\\Roses are red
Violets are blue`
    expect(Up.ast(text)).to.be.eql(
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
  
  it('does not impact the parsing of the previous line', () => {
    const text =
      `
Roses are red
\\Violets are blue`
    expect(Up.ast(text)).to.be.eql(
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


describe('A line with an escaped line break followed by another line', () => {
  it('do not produce a line block node', () => {
    const text =
      `
Roses are red\\
Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
            new PlainTextNode('Roses are red\nViolets are blue')
        ]),
      ]))
  })
})


describe('Within a line block, a line with an escaped line break followed by another line', () => {
  it('are considered part of the same line', () => {
    const text =
      `
Roses are red\\
Violets are blue
Lyrics have lines
And addresses do, too`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red\nViolets are blue')
          ]),
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ])
      ]))
  })
})


describe('An empty line with an escaped line break followed by another empty line', () => {  
  it('are considered part of the same line can be included in a line break', () => {
    const text =
      `
Roses are red
\\

Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('\n')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})
