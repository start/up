import { expect } from 'chai'
import Up from '../../../index'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('The term that represents video conventions', () => {
  const up = new Up({
    i18n: {
      terms: { audio: 'listen' }
    }
  })

  it('comes from the "audio" config term', () => {
    const text = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new AudioNode('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const lowercase = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'
    const misedCase = '[LiStEn: chanting at Nevada caucus][https://example.com/audio.ogg]'

    expect(up.toAst(misedCase)).to.be.eql(up.toAst(lowercase))
  })
})
