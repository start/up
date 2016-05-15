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
    configChanges: UpConfigArgs,
    configChangesToIgnoreDueToOverwriting: UpConfigArgs
  }
): void {

  const { text, configChanges, configChangesToIgnoreDueToOverwriting } = args

  const whenProvidingConfigAtCreation =
    new Up(configChanges).toAst(text)

  const whenProvidingChangesWhenCallingDefaultMethod =
    new Up().toAst(text, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(configChangesToIgnoreDueToOverwriting).toAst(text, configChanges)

  it('has the same result as providing the term when calling the (default) static toAst method', () => {
    expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
  })

  it("has the same result as providing the term when calling object's toAst method", () => {
    expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
  })

  it("has the same result as providing the term when calling object's toAst method", () => {
    expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
  })
}

describe('The "audio" config term', () => {
  canBeProvidedMultipleWaysWithTheSameResult({
    text: '[listen: chanting at Nevada caucus -> https://example.com/audio.ogg]',
    configChanges: {
      i18n: {
        terms: { audio: 'listen' }
      }
    },
    configChangesToIgnoreDueToOverwriting: {
      i18n: {
        terms: { audio: 'sound' }
      }
    }
  })
})


describe('The "image" config term', () => {
  canBeProvidedMultipleWaysWithTheSameResult({
    text: '[see: Chrono Cross logo -> https://example.com/cc.png]',
    configChanges: {
      i18n: {
        terms: { image: 'see' }
      }
    },
    configChangesToIgnoreDueToOverwriting: {
      i18n: {
        terms: { image: 'picture' }
      }
    }
  })
})


describe('The "video" config term', () => {
  canBeProvidedMultipleWaysWithTheSameResult({
    text: '[watch: Nevada caucus footage -> https://example.com/video.webm]',
    configChanges: {
      i18n: {
        terms: { video: 'watch' }
      }
    },
    configChangesToIgnoreDueToOverwriting: {
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
    configChanges: {
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    },
    configChangesToIgnoreDueToOverwriting: {
      i18n: {
        terms: { spoiler: 'look away' }
      }
    }
  })
})
