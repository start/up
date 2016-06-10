import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { NotSafeForWorkNode } from '../../../SyntaxNodes/NotSafeForWorkNode'


describe('The term that represents NSFW conventions', () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'explicit' }
      }
    })
    
  it('comes from the "nsfw" config term ', () => {
    expect(up.toAst('[explicit: Ash fights naked Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new NotSafeForWorkNode([
          new PlainTextNode('Ash fights naked Gary')
        ])
      ]))
  })
  
  it('is case-insensitive even when custom', () => {
    const uppercase = '[EXPLICIT: Ash fights naked Gary]'
    const mixedCase = '[eXplIciT: Ash fights naked Gary]'
    
    expect(up.toAst(uppercase)).to.be.eql(up.toAst(mixedCase))
  })
})
