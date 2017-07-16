// The purpose of this unpleasant hack is to make both `parsing` and `rendering`
// settings optional, while still requiring that at least one of the two be provided.
export type Settings =
  {
    parsing?: Settings.Parsing
    rendering: Settings.Rendering
  } | {
    parsing: Settings.Parsing
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
