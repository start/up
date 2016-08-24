export interface UserProvidedSettings {
  createSourceMap?: boolean
  renderUnsafeContent?: boolean
  idPrefix?: string
  defaultUrlScheme?: string
  baseForUrlsStartingWithSlash?: string
  baseForUrlsStartingWithHashMark?: string

  terms?: UserProvidedSettings.Terms
}


export namespace UserProvidedSettings {
  export interface Terms {
    markup?: Terms.Markup
    output?: Terms.Rendered
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

    export type FoundInMarkup = string[] | string

    export interface Rendered {
      footnote?: Terms.RenderedToOutput
      footnoteReference?: Terms.RenderedToOutput
      itemReferencedByTableOfContents?: Terms.RenderedToOutput
      tableOfContents?: Terms.RenderedToOutput
      toggleNsfl?: Terms.RenderedToOutput
      toggleNsfw?: Terms.RenderedToOutput
      toggleSpoiler?: Terms.RenderedToOutput
    }

    export type RenderedToOutput = string
  }
}
