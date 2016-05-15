import { expect } from 'chai'
import { UpConfigArgs } from '../../../UpConfigArgs'
import { Up } from '../../../index'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


function canBeProvidedMultipleWaysWithTheSameResult(
  args: {
    text: string,
    textForDefaultSettings: string
    configChanges: UpConfigArgs,
    conflictingConfigChanges: UpConfigArgs
  }
): void {

  const { text, textForDefaultSettings, configChanges, conflictingConfigChanges } = args

  const whenProvidingConfigAtCreation =
    new Up(configChanges).toAst(text)

  const whenProvidingChangesWhenCallingDefaultMethod =
    new Up().toAst(text, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).toAst(text, configChanges)

  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
  })

  it("has the same result as providing the term when calling the Up object's toAst method", () => {
    expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
  })

  it("has the same result as providing the term when calling the Up object's toAst method", () => {
    expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
  })

  it("does not alter the Up object's original settings when the term is provided to the object's toAst method", () => {
    const up = new Up(configChanges)
    
    // We don't care about the result! We only care to ensure the original config settings weren't overwritten.
    up.toAst(text, conflictingConfigChanges)
    
    expect(whenProvidingConfigAtCreation).to.be.eql(up.toAst(text, configChanges))
  })

  it("does not alter subsequent calls to the (default) static toAst method when the term is provided to it", () => {
    expect(Up.toAst(text, configChanges)).to.be.eql(Up.toAst(textForDefaultSettings))
  })
}


describe('The "audio" config term', () => {
  canBeProvidedMultipleWaysWithTheSameResult({
    text: '[listen: chanting at Nevada caucus -> https://example.com/audio.ogg]',
    textForDefaultSettings: '[audio: chanting at Nevada caucus -> https://example.com/audio.ogg]',
    configChanges: {
      i18n: {
        terms: { audio: 'listen' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { audio: 'sound' }
      }
    }
  })
})


describe('The "image" config term', () => {
  canBeProvidedMultipleWaysWithTheSameResult({
    text: '[see: Chrono Cross logo -> https://example.com/cc.png]',
    textForDefaultSettings: '[image: Chrono Cross logo -> https://example.com/cc.png]',
    configChanges: {
      i18n: {
        terms: { image: 'see' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { image: 'picture' }
      }
    }
  })
})


describe('The "video" config term', () => {
  canBeProvidedMultipleWaysWithTheSameResult({
    text: '[watch: Nevada caucus footage -> https://example.com/video.webm]',
    textForDefaultSettings: '[video: Nevada caucus footage -> https://example.com/video.webm]',
    configChanges: {
      i18n: {
        terms: { video: 'watch' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { video: 'watch' }
      }
    }
  })
  const configChanges: UpConfigArgs = {
    i18n: {
      terms: { video: 'movie' }
    }
  }
})


describe('The "spoiler" config term', () => {
  canBeProvidedMultipleWaysWithTheSameResult({
    text: '[RUINS ENDING: Ash fights Gary]',
    textForDefaultSettings: '[SPOILER: Ash fights Gary]',
    configChanges: {
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    },
    conflictingConfigChanges: {
      i18n: {
        terms: { spoiler: 'look away' }
      }
    }
  })
})
