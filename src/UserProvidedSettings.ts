// The purpose of this unpleasant hack is to make both `parsing` and `rendering`
// settings optional, while still requiring that at least one of the two be provided.
export type UserProvidedSettings =
  {
    parsing?: UserProvidedSettings.Parsing
    rendering: UserProvidedSettings.Rendering
  } | {
    parsing: UserProvidedSettings.Parsing
    rendering?: UserProvidedSettings.Rendering
  }


export namespace UserProvidedSettings {
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
// Both `UserProvidedSettings.Parsing` and `UserProvidedSettings.Rendering` interfaces
// only have optional fields. This unfortunately means they're satisfied by every type,
// including the `UserProvidedSettings` interface!
// 
// We want to prevent users from accidentally passing `UserProvidedSettings` to a method
// that expects `UserProvidedSettings.Parsing` or `UserProvidedSettings.Rendering`.
//
// Our solution is to extend the `SpecificSettings` interface, which is incompatible
// with `UserProvidedSettings`.
export interface SpecificSettings {
  rendering?: DoNotProvide,
  parsing?: DoNotProvide
}

export interface DoNotProvide {
  DO_NOT_PROVIDE(): void
}
