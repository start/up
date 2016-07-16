import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'


describe('Text surrounded by curly brackets', () => {
  it('is put inside an action node with the curly brackets preserved as plain text', () => {
    expect(Up.toAst('Well... {sigh} We have some work to do.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well... '),
        new ActionNode([
          new PlainTextNode('sigh')
        ]),
        new PlainTextNode(' We have some work to do.')
      ]))
  })
})


describe('The text of an action', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('Well... {the *deepest* sigh} We have some work to do.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well... '),
        new ActionNode([
          new PlainTextNode('the '),
          new EmphasisNode([
            new PlainTextNode('deepest')
          ]),
          new PlainTextNode(' sigh')
        ]),
        new PlainTextNode(' We have some work to do.')
      ]))
  })
})


describe('Nested curly brackets starting at the same time', () => {
  it("produce nested action nodes starting at the same time", () => {
    expect(Up.toAst('Well... {{gasp} die} We have some work to do.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well... '),
        new ActionNode([
          new ActionNode([
            new PlainTextNode('gasp')
          ]),
          new PlainTextNode(' die')
        ]),
        new PlainTextNode(' We have some work to do.')
      ]))
  })
})


describe('Nested curly brackets ending at the same time', () => {
  it("produce action nodes ending at the same time", () => {
    expect(Up.toAst('Well... {die {gasp}} We have some work to do.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well... '),
        new ActionNode([
          new PlainTextNode('die '),
          new ActionNode([
            new PlainTextNode('gasp')
          ]),
        ]),
        new PlainTextNode(' We have some work to do.')
      ]))
  })
})


describe('Two left curly brackets followed by a single right curly bracket', () => {
  it('produce an action node starting from the second left curly bracket', () => {
    expect(Up.toAst(':{ Well... {the *deepest* sigh} We have some work to do.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode(':{ Well... '),
        new ActionNode([
          new PlainTextNode('the '),
          new EmphasisNode([
            new PlainTextNode('deepest')
          ]),
          new PlainTextNode(' sigh')
        ]),
        new PlainTextNode(' We have some work to do.')
      ]))
  })
})


describe('A left curly bracket followed by two right curly brackets', () => {
  it('produce an action node ending with the first right curly bracket', () => {
    expect(Up.toAst('Well... {the *deepest* sigh} We have some work to do. :}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well... '),
        new ActionNode([
          new PlainTextNode('the '),
          new EmphasisNode([
            new PlainTextNode('deepest')
          ]),
          new PlainTextNode(' sigh')
        ]),
        new PlainTextNode(' We have some work to do. :}')
      ]))
  })
})


describe("A curly bracket followed by whitespace", () => {
  it('does not open an action conventions', () => {
    expect(Up.toAst("I can't eat most pizza. 8o{ But I can have some! 8o}")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I can't eat most pizza. 8o{ But I can have some! 8o}")
      ]))
  })
})