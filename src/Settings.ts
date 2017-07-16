export interface Settings {
  parsing?: Settings.Parsing
  rendering?: Settings.Rendering
}

export namespace Settings {
  export interface Parsing {
    createSourceMap?: boolean
    defaultUrlScheme?: string
    baseForUrlsStartingWithSlash?: string
    baseForUrlsStartingWithHashMark?: string
    fancyEllipsis?: string
    keywords?: Parsing.Keywords
  }

  export namespace Parsing {
    export interface Keywords {
      audio?: Keyword
      image?: Keyword
      revealable?: Keyword
      sectionLink?: Keyword
      table?: Keyword
      video?: Keyword
    }

    export type Keyword = string[] | string
  }


  export interface Rendering {
    idPrefix?: string
    renderDangerousContent?: boolean
    terms?: Rendering.Terms
  }

  export namespace Rendering {
    export interface Terms {
      footnote?: Term
      footnoteReference?: Term
      hide?: Term
      reveal?: Term
      sectionReferencedByTableOfContents?: Term
    }

    export type Term = string
  }
}
