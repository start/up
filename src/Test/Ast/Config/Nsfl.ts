import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { NotSafeForLifeNode } from '../../../SyntaxNodes/NotSafeForLifeNode'


describe('The term that represents NSFL conventions', () => {
    const up = new Up({
      i18n: {
        terms: { nsfl: 'ruins life' }
      }
    })
    
  it('comes from the "nsfw" config term ', () => {
    expect(up.toAst('[ruins life: Ash eats rotten Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new NotSafeForLifeNode([
          new PlainTextNode('Ash eats rotten Gary')
        ])
      ]))
  })
  
  it('is case-insensitive even when custom', () => {
    const uppercase = '[RUINS LIFE: Ash eats rotten Gary]'
    const mixedCase = '[RuINs LiFe: Ash eats rotten Gary]'
    
    expect(up.toAst(uppercase)).to.be.eql(up.toAst(mixedCase))
  })
})
