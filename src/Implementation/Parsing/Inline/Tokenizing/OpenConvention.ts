import { ConventionVariation } from './ConventionVariation'
import { ForgivingConventionHandler } from './ForgivingConventions/ForgivingConventionHandler'
import { Token } from './Token'


export class OpenConvention {
  constructor(
    public convention: ConventionVariation,
    public tokenizerSnapshotWhenOpening: {
      markupIndex: number
      markupIndexThatLastOpenedAConvention?: number
      bufferedContent: string
      tokens: Token[]
      openConventions: OpenConvention[]
      forgivingConventionHandlers: ForgivingConventionHandler[]
    },
    public startTokenIndex = tokenizerSnapshotWhenOpening.tokens.length) { }

  clone(): OpenConvention {
    return new OpenConvention(
      this.convention,
      this.tokenizerSnapshotWhenOpening,
      this.startTokenIndex)
  }
}
