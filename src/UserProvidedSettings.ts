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
    audio?: Terms.FoundInMarkup
    chart?: Terms.FoundInMarkup
    highlight?: Terms.FoundInMarkup
    image?: Terms.FoundInMarkup
    nsfl?: Terms.FoundInMarkup
    nsfw?: Terms.FoundInMarkup
    reference?: Terms.FoundInMarkup
    spoiler?: Terms.FoundInMarkup
    table?: Terms.FoundInMarkup
    video?: Terms.FoundInMarkup

    footnote?: Terms.FoundInOutput
    footnoteReference?: Terms.FoundInOutput
    itemReferencedByTableOfContents?: Terms.FoundInOutput
    tableOfContents?: Terms.FoundInOutput
    toggleNsfl?: Terms.FoundInOutput
    toggleNsfw?: Terms.FoundInOutput
    toggleSpoiler?: Terms.FoundInOutput
  }


  export namespace Terms {
    export type FoundInMarkup = string[] | string
    export type FoundInOutput = string
  }
}
