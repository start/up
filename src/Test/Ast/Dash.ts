import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('2 consecutive dashes normally produce an en dash.', () => {
  specify('This applies in regular text', () => {
    expect(Up.toAst("Okay--I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay–I'll eat the tarantula.")
      ]))
  })
})


describe('When either of the dashes are escaped, no en dash is produced:', () => {
  specify('First dash:', () => {
      expect(Up.toAst("Okay\\--I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay--I'll eat the tarantula.")
      ]))
  })

    specify('Second dash:', () => {
      expect(Up.toAst("Okay-\\-I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay--I'll eat the tarantula.")
      ]))
  })
})
