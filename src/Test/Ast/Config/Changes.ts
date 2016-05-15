import { expect } from 'chai'
import { UpConfigArgs } from '../../../UpConfigArgs'
import { Up } from '../../../index'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


function expectConfigChangesToHaveSameEffectWhenProvidedToDefaultMethod(text: string, configChanges: UpConfigArgs): void {
  const whenProvidingConfigAtCreation =
    new Up(configChanges).toAst(text)

  const whenProvidingChangesWhenCallingMethod =
    Up.toAst(text, configChanges)

  expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingMethod)
}

function expectConfigChangesToHaveSameEffectWhenProvidedToMethodOfUpObject(text: string, configChanges: UpConfigArgs): void {
  const whenProvidingConfigAtCreation =
    new Up(configChanges).toAst(text)

  const whenProvidingChangesWhenCallingMethod =
    new Up().toAst(text, configChanges)

  expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingMethod)
}

describe('Providing the "audio" config term when creating the Up object', () => {
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { audio: 'listen' }
    }
  }

  const text = '[listen: chanting at Nevada caucus -> https://example.com/audio.ogg]'

  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultMethod(text, configChanges)
  })

  it("has the same result as providing the term when calling object's toAst method instead", () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToMethodOfUpObject(text, configChanges)
  })
})


describe('Providing the "image" config term when creating the Up object', () => {
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { image: 'see' }
    }
  }

  const text = '[see: Chrono Cross logo -> https://example.com/cc.png]'

  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultMethod(text, configChanges)
  })

  it("has the same result as providing the term when calling object's toAst method instead", () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToMethodOfUpObject(text, configChanges)
  })
})


describe('Providing the "video" config term when creating the Up object', () => {
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { video: 'watch' }
    }
  }
  
    const text = '[watch: Nevada caucus footage -> https://example.com/video.webm]'
    
  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultMethod(text, configChanges)
  })

  it("has the same result as providing the term when calling object's toAst method instead", () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToMethodOfUpObject(text, configChanges)
  })
})


describe('Providing the "spoiler" config term when creating the Up object', () => {
    const text = '[RUINS ENDING: Ash fights Gary]'
  
  const configChanges: UpConfigArgs = {
    i18n: {
          terms: { spoiler: 'ruins ending' }
    }
  }
    
  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToDefaultMethod(text, configChanges)
  })

  it("has the same result as providing the term when calling object's toAst method instead", () => {
    expectConfigChangesToHaveSameEffectWhenProvidedToMethodOfUpObject(text, configChanges)
  })
})
