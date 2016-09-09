export interface UserProvidedSettings {
  parsing: UserProvidedSettings.Parsing
  rendering: UserProvidedSettings.Rendering
}


export namespace UserProvidedSettings {
  export interface Parsing {
    createSourceMap?: boolean
    defaultUrlScheme?: string
    baseForUrlsStartingWithSlash?: string
    baseForUrlsStartingWithHashMark?: string
    ellipsis?: string
    terms?: Parsing.Terms
  }

  export namespace Parsing {
    export interface Terms {
      audio?: Term
      chart?: Term
      highlight?: Term
      image?: Term
      nsfl?: Term
      nsfw?: Term
      sectionLink?: Term
      spoiler?: Term
      table?: Term
      video?: Term
    }

    export type Term = string[] | string
  }


  export interface Rendering {
    idPrefix?: string
    renderUnsafeContent?: boolean
    terms?: Rendering.Terms
  }

  export namespace Rendering {
    export interface Terms {
      footnote?: Term
      footnoteReference?: Term
      sectionReferencedByTableOfContents?: Term
      tableOfContents?: Term
      toggleNsfl?: Term
      toggleNsfw?: Term
      toggleSpoiler?: Term
    }

    export type Term = string
  }
}
