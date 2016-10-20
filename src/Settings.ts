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
  export interface Parsing extends SpecificSettings {
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
      highlight?: Keyword
      image?: Keyword
      revealable?: Keyword
      sectionLink?: Keyword
      table?: Keyword
      video?: Keyword
    }

    export type Keyword = string[] | string
  }


  export interface Rendering extends SpecificSettings {
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


// This is another hack to work around TypeScript's type system.
//
// Both `Settings.Parsing` and `Settings.Rendering` interfaces only have optional
// fields. This unfortunately means they're satisfied by every type,  including the
// `Settings` interface!
// 
// We want to prevent users from accidentally passing `Settings` to a method that
// expects `Settings.Parsing` or `Settings.Rendering`.
//
// Our solution is to extend the `SpecificSettings` interface, which is incompatible
// with `Settings`.
export interface SpecificSettings {
  rendering?: DoNotProvide,
  parsing?: DoNotProvide
}

export interface DoNotProvide {
  DO_NOT_PROVIDE(): void
}
