import { expect } from 'chai'
import Up from '../../../index'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { insideDocumentAndParagraph } from '../Helpers'


describe('An empty revision insertion containing an empty revision deletion', () => {
  it('produces no syntax nodes', () => {
    expect(Up.toAst('I have nothing to add or remove: ++~~~~++')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I have nothing to add or remove: ')
      ])
    )
  })
})
