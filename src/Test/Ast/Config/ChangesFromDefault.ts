import { expect } from 'chai'
import { UpConfigArgs } from '../../../UpConfigArgs'
import { Up } from '../../../index'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('Providing the "audio" config term when creating the Up object', () => {
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { audio: 'listen' }
    }
  }

  const up = new Up(configChanges)

  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    const text = '[listen: chanting at Nevada caucus -> https://example.com/audio.ogg]'

    const astFromOriginalConfig = up.toAst(text)
    const astFromChangesToDefault = Up.toAst(text, configChanges)

    expect(astFromOriginalConfig).to.be.eql(astFromChangesToDefault)
  })
})


describe('Providing the "image" config term when creating the Up object', () => {
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { image: 'see' }
    }
  }

  const up = new Up(configChanges)

  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    const text = '[see: Chrono Cross logo -> https://example.com/cc.png]'

    const astFromOriginalConfig = up.toAst(text)
    const astFromChangesToDefault = Up.toAst(text, configChanges)

    expect(astFromOriginalConfig).to.be.eql(astFromChangesToDefault)
  })
})



describe('Providing the "video" config term when creating the Up object', () => {
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { video: 'watch' }
    }
  }

  const up = new Up(configChanges)

  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    const text = '[watch: Nevada caucus footage -> https://example.com/video.webm]'

    const astFromOriginalConfig = up.toAst(text)
    const astFromChangesToDefault = Up.toAst(text, configChanges)

    expect(astFromOriginalConfig).to.be.eql(astFromChangesToDefault)
  })
})
