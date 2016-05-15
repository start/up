import { expect } from 'chai'
import { Up } from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'


describe('The term that represents spoiler conventions', () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })
    
  it('comes from the "spoiler" config term ', () => {
    expect(up.toAst('[ruins ending: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })
  
  it('is always canse-insensivite', () => {
    const uppercase = '[RUINS ENDING: Ash fights Gary]'
    const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'
    
    expect(up.toAst(uppercase)).to.be.eql(up.toAst(mixedCase))
  })
})
