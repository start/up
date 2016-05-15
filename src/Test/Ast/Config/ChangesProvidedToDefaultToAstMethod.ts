import { expect } from 'chai'
import { UpConfigArgs } from '../../../UpConfigArgs'
import { Up } from '../../../index'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


function expectConfigChangesToHaveSameEffectWhenProvidedToDefaultToAstMethod(text: string, configChanges: UpConfigArgs): void {
  const up = new Up(configChanges)

  const whenProvidingConfigAtCreation =
    up.toAst(text)

  const whenProvidingChangesWhenCallingMethod =
    Up.toAst(text, configChanges)

  expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingMethod)
}

describe('Providing the "audio" config term when creating the Up object', () => {
  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    const text = '[listen: chanting at Nevada caucus -> https://example.com/audio.ogg]'

    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultToAstMethod(text, {
      i18n: {
        terms: { audio: 'listen' }
      }
    })
  })
})


describe('Providing the "image" config term when creating the Up object', () => {
  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    const text = '[see: Chrono Cross logo -> https://example.com/cc.png]'

    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultToAstMethod(text, {
      i18n: {
        terms: { image: 'see' }
      }
    })
  })
})


describe('Providing the "video" config term when creating the Up object', () => {
  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    const text = '[watch: Nevada caucus footage -> https://example.com/video.webm]'

    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultToAstMethod(text, {
      i18n: {
        terms: { video: 'watch' }
      }
    })
  })
})


describe('Providing the "spoiler" config term when creating the Up object', () => {
  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    const text = '[RUINS ENDING: Ash fights Gary]'

    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultToAstMethod(text, {
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })
  })
})
