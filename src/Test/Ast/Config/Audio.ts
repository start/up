import { expect } from 'chai'
import { Up } from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('The term that represents video conventions', () => {
    const up = new Up({
      i18n: {
        terms: { audio: 'listen' }
      }
    })
    
  it('comes from the "audio" config term', () => {
    const text = '[listen: chanting at Nevada caucus -> https://example.com/audio.ogg]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ])
    )
  })
    
  it('is always case insensitive', () => {
    const text = '[LISTEN: chanting at Nevada caucus -> https://example.com/audio.ogg]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ])
    )
  })
})
