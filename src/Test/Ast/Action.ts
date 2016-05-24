import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'

// TODO: Update input strings to reflect new purpose of curly brackets

describe('Text surrounded by curly brackets', () => {
  it('is put inside an action node with the curly brackets preserved as plain text', () => {
    expect(Up.toAst('I like {certain types of} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ActionNode([
          new PlainTextNode('certain types of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('The text of an action', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like {certain *types* of} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ActionNode([
          new PlainTextNode('certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Nested curly brackets starting at the same time', () => {
  it("produce nested action nodes starting at the same tmie", () => {
    expect(Up.toAst('I like {{certain} types of} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ActionNode([
          new ActionNode([
            new PlainTextNode('certain')
          ]),
          new PlainTextNode(' types of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Nested curly brackets ending at the same time', () => {
  it("produce action nodes ending at the same time", () => {
    expect(Up.toAst('I like {certain {types of}} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ActionNode([
          new PlainTextNode('certain '),
          new ActionNode([
            new PlainTextNode('types of')
          ]),
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Two left curly brackets followed by a single right curly bracket', () => {
  it('produce an action node starting from the second left curly bracket', () => {
    expect(Up.toAst(':{ I like {certain *types* of} pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode(':{ I like '),
        new ActionNode([
          new PlainTextNode('certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of')
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
        new ActionNode([
          new PlainTextNode('certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of')
        ]),
        new PlainTextNode(' pizza :}')
      ]))
  })
})