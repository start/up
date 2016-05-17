import { expect } from 'chai'
import { UpConfigArgs } from '../../../UpConfigArgs'
import Up from '../../../index'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


function itCanBeProvidedMultipleWaysWithTheSameResult(
  args: {
    text: string,
    textForDefaultSettings: string
    configChanges: UpConfigArgs,
    conflictingConfigChanges: UpConfigArgs
  }
): void {

  const { text, textForDefaultSettings, configChanges, conflictingConfigChanges } = args


  describe("when provided to the default (static) toAst method", () => {
    it("does not alter subsequent calls to the default method", () => {
      expect(Up.toAst(text, configChanges)).to.be.eql(Up.toAst(textForDefaultSettings))
    })
  })

  const whenProvidingConfigAtCreation =
    new Up(configChanges).toAst(text)

  const whenProvidingChangesWhenCallingDefaultMethod =
    Up.toAst(text, configChanges)
    
  const whenProvidingChangesWhenCallingtMethodOnObject =
    new Up().toAst(text, configChanges)

  const whenOverwritingChangesProvidedAtCreation =
    new Up(conflictingConfigChanges).toAst(text, configChanges)

  describe("when provided to an Up object's toAst method", () => {
    it("does not alter the Up object's original settings", () => {
      const up = new Up(configChanges)

      // We don't care about the result! We only care to ensure the original config settings weren't overwritten.
      up.toAst(text, conflictingConfigChanges)

      expect(whenProvidingConfigAtCreation).to.be.eql(up.toAst(text, configChanges))
    })
  })

  describe('when provided to an Up object at creation', () => {
    it('has the same result as providing the term when calling the (default) static toAst method', () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingDefaultMethod)
    })

    it("has the same result as providing the term when calling the Up object's toAst method", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenProvidingChangesWhenCallingtMethodOnObject)
    })

    it("has the same result as providing the term when calling the Up object's toAst method, overwriting the term provided at creation", () => {
      expect(whenProvidingConfigAtCreation).to.be.eql(whenOverwritingChangesProvidedAtCreation)
    })
  })
}


describe('The "audio" config term', () => {
  itCanBeProvidedMultipleWaysWithTheSameResult({
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
  itCanBeProvidedMultipleWaysWithTheSameResult({
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
  itCanBeProvidedMultipleWaysWithTheSameResult({
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
  itCanBeProvidedMultipleWaysWithTheSameResult({
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
