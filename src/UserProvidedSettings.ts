export interface UserProvidedSettings {
  createSourceMap?: boolean
  writeUnsafeContent?: boolean
  documentName?: string
  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithHashMark?: string

  terms?: UserProvidedSettings.Terms
}


export namespace UserProvidedSettings {
  export interface Terms {
    markup: Terms.Markup
    output: Terms.Output
  }

  export namespace Terms {
    export interface Markup {
      audio?: Terms.FoundInMarkup
      chart?: Terms.FoundInMarkup
      highlight?: Terms.FoundInMarkup
      image?: Terms.FoundInMarkup
      nsfl?: Terms.FoundInMarkup
      nsfw?: Terms.FoundInMarkup
      referencedSection?: Terms.FoundInMarkup
      spoiler?: Terms.FoundInMarkup
      table?: Terms.FoundInMarkup
      video?: Terms.FoundInMarkup
    }

    export interface Output {
      footnote?: Terms.FoundInOutput
      footnoteReference?: Terms.FoundInOutput
      itemReferencedByTableOfContents?: Terms.FoundInOutput
      tableOfContents?: Terms.FoundInOutput
      toggleNsfl?: Terms.FoundInOutput
      toggleNsfw?: Terms.FoundInOutput
      toggleSpoiler?: Terms.FoundInOutput
    }

    export type FoundInMarkup = string[] | string
    export type FoundInOutput = string
  }
}
