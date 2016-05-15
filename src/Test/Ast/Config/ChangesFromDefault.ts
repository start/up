import { expect } from 'chai'
import { UpConfigArgs } from '../../../UpConfigArgs'
import { Up } from '../../../index'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('Providing config options when creating the Up object', () => {
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { audio: 'listen' }
    }
  }

  const up = new Up(configChanges)

  it('has the same result as providing them when calling the (default) static toAst method', () => {
    const text = '[listen: chanting at Nevada caucus -> https://example.com/audio.ogg]'
    
    const astFromOriginalConfig = up.toAst(text)
    const astFromChangesToDefault = Up.toAst(text, configChanges)

    expect(astFromOriginalConfig).to.be.eql(astFromChangesToDefault)
  })
})
