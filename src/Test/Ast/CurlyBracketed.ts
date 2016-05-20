import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { CurlyBracketedNode } from '../../SyntaxNodes/CurlyBracketedNode'


describe('Text surrounded by curly brackets', () => {
  it('is put inside a curly bracketed node with the curly brackets preserved as plain text', () => {
    expect(Up.toAst('I like {certain types of} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new CurlyBracketedNode([
          new PlainTextNode('{certain types of}')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('curly bracketed text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like {certain *types* of} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new CurlyBracketedNode([
          new PlainTextNode('{certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of]')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Two left curly brackets followed by a single right curly bracket', () => {
  it('produces bracketed text starting from the second left curly bracket', () => {
    expect(Up.toAst(':{ I like {certain *types* of} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode(':{ I like '),
        new CurlyBracketedNode([
          new PlainTextNode('{certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of]')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('A left curly bracket followed by two right curly brackets', () => {
  it('produces bracketed text ending with the first right curly bracket', () => {
    expect(Up.toAst('I like {certain *types* of} pizza :}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new CurlyBracketedNode([
          new PlainTextNode('{certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of}')
        ]),
        new PlainTextNode(' pizza :}')
      ]))
  })
})