import { ConventionDefinition } from './ConventionDefinition'
import { ForgivingConventionHandler } from './ForgivingConventions/ForgivingConventionHandler'
import { Token } from './Token'


export class OpenConvention {
  constructor(
    public definition: ConventionDefinition,
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
      this.definition,
      this.tokenizerSnapshotWhenOpening,
      this.startTokenIndex)
  }
}
