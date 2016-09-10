// This is an unpleasant hack.
//
// Its purpose is to make both `parsing` and `rendering` settings optional, while still
// requiring that at least one of the two be provided.
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


  export interface Rendering extends SpecificSettings {
    idPrefix?: string
    renderDangerousContent?: boolean
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


// This is another hack to work around TypeScript's type system.
//
// Both `UserProvidedSettings.Parsing` and `UserProvidedSettings.Rendering` interfaces
// only have optional fields, so they're satisfied by any object.
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
