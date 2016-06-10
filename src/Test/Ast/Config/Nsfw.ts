import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'


describe('The term that represents NSFW conventions', () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'explicit' }
      }
    })
    
  it('comes from the "nsfw" config term ', () => {
    expect(up.toAst('[explicit: Ash wrestles naked Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new NsfwNode([
          new PlainTextNode('Ash wrestles naked Gary')
        ])
      ]))
  })
  
  it('is case-insensitive even when custom', () => {
    const uppercase = '[EXPLICIT: Ash wrestles naked Gary]'
    const mixedCase = '[eXplIciT: Ash wrestles naked Gary]'
    
    expect(up.toAst(uppercase)).to.be.eql(up.toAst(mixedCase))
  })
})
