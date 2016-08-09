import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('A plus symbol followed by a hyphen normally produces a plus-minus sign', () => {
  context('This applies within regular text:', () => {
    specify('Between words', () => {
      expect(Up.toAst("Yeah, it uses base HP+-4.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("Yeah, it uses base HP±4.")
        ]))
    })

    specify('Following a word', () => {
      expect(Up.toAst("I have 10+- ...")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("I have 10± ...")
        ]))
    })

    specify('Preceding a word', () => {
      expect(Up.toAst('I have three homes, +-two.')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('I have three homes, ±two.')
        ]))
    })

    specify('Surrounded by whitespace', () => {
      expect(Up.toAst("Well, +- a million.")).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode("Well, ± a million.")
        ]))
    })
  })
})
