import { FORWARD_SLASH, HASH_MARK } from './PatternPieces'
import { URL_SCHEME_PATTERN } from './Patterns'
import { UserProvidedSettings } from './UserProvidedSettings'
import { coalesce, distinct } from './CollectionHelpers'


export class Settings {
  parsing = new Settings.Parsing()
  rendering = new Settings.Rendering()

  constructor(settings?: UserProvidedSettings) {
    this.applyUserProvidedSettings(settings)
  }

  // Returns a new `Settings` object with the changes applied.
  withChanges(changes: UserProvidedSettings): Settings {
    const clone = new Settings()

    clone.parsing = this.parsing.clone()
    clone.rendering = this.rendering.clone()

    clone.applyUserProvidedSettings(changes)

    return clone
  }

  private applyUserProvidedSettings(settings: UserProvidedSettings): void {
    if (!settings) {
      return
    }

    this.parsing.applyUserProvidedSettings(settings.parsing)
    this.rendering.applyUserProvidedSettings(settings.rendering)
  }
}


export namespace Settings {
  export class Parsing {
    createSourceMap = false
    fancyEllipsis = '…'
    keywords = new Parsing.Keywords()

    private defaultUrlScheme = 'https://'
    private baseForUrlsStartingWithSlash = ''
    private baseForUrlsStartingWithHashMark = ''

    clone(): Parsing {
      const clone = new Parsing()

      clone.createSourceMap = this.createSourceMap
      clone.fancyEllipsis = this.fancyEllipsis
      clone.defaultUrlScheme = this.defaultUrlScheme
      clone.baseForUrlsStartingWithSlash = this.baseForUrlsStartingWithSlash
      clone.baseForUrlsStartingWithHashMark = this.baseForUrlsStartingWithHashMark
      clone.keywords = this.keywords.clone()

      return clone
    }

    applyUserProvidedSettings(settings: UserProvidedSettings.Parsing): void {
      if (!settings) {
        return
      }

      this.createSourceMap =
        coalesce(settings.createSourceMap, this.createSourceMap)

      this.fancyEllipsis =
        coalesce(settings.fancyEllipsis, this.fancyEllipsis)

      this.defaultUrlScheme =
        coalesce(settings.defaultUrlScheme, this.defaultUrlScheme)

      this.baseForUrlsStartingWithSlash =
        coalesce(settings.baseForUrlsStartingWithSlash, this.baseForUrlsStartingWithSlash)

      this.baseForUrlsStartingWithHashMark =
        coalesce(settings.baseForUrlsStartingWithHashMark, this.baseForUrlsStartingWithHashMark)

      this.keywords.applyUserProvidedSettings(settings.keywords)
    }

    // Applies the relevant settings settings to `url` and returns the result.
    //
    // This method assumes that `url` is non-blank.
    applySettingsToUrl(url: string): string {
      url = url.trim()

      switch (url[0]) {
        case FORWARD_SLASH:
          return this.baseForUrlsStartingWithSlash + url

        case HASH_MARK:
          return this.baseForUrlsStartingWithHashMark + url
      }

      return (
        URL_SCHEME_PATTERN.test(url)
          ? url
          : this.defaultUrlScheme + url)
    }
  }


  export namespace Parsing {
    export class Keywords {
      // Users can provide custom variations for keywords, but users can't overwrite the
      // default variations.
      //
      // However, users *can* overwrite their own custom variations! If the user creates
      // a `Transformer` object and provides custom keywords to its constructor, those
      // keywords can be overwritten by providing the `parse` method with a different set
      // of keywords.
      //
      // The private fields below represent the (sanitized) variations provided by the user
      // for each keyword.
      private _audio: Keyword = []
      private _highlight: Keyword = []
      private _image: Keyword = []
      private _revealable: Keyword = []
      private _sectionLink: Keyword = []
      private _table: Keyword = []
      private _video: Keyword = []

      get audio(): Keyword {
        return distinct('audio', ...this._audio)
      }

      get highlight(): Keyword {
        return distinct('highlight', ...this._highlight)
      }

      get image(): Keyword {
        return distinct('image', 'img', ...this._image)
      }

      get revealable(): Keyword {
        return distinct('spoiler', 'nsfw', 'nsfl', 'revealable', ...this._revealable)
      }

      get sectionLink(): Keyword {
        return distinct('section', 'topic', ...this._sectionLink)
      }

      get table(): Keyword {
        return distinct('table', ...this._table)
      }

      get video(): Keyword {
        return distinct('video', 'vid', ...this._video)
      }

      clone(): Keywords {
        const clone = new Keywords()

        clone._audio = this._audio
        clone._highlight = this._highlight
        clone._image = this._image
        clone._revealable = this._revealable
        clone._sectionLink = this._sectionLink
        clone._table = this._table
        clone._video = this._video

        return clone
      }

      applyUserProvidedSettings(keywords: UserProvidedSettings.Parsing.Keywords): void {
        if (!keywords) {
          return
        }

        this._audio =
          sanitizeVariations(keywords.audio)

        this._highlight =
          sanitizeVariations(keywords.highlight)

        this._image =
          sanitizeVariations(keywords.image)

        this._revealable =
          sanitizeVariations(keywords.revealable)

        this._sectionLink =
          sanitizeVariations(keywords.sectionLink)

        this._table =
          sanitizeVariations(keywords.table)

        this._video =
          sanitizeVariations(keywords.video)
      }
    }

    export type Keyword = string[]
  }


  export class Rendering {
    idPrefix = 'up'
    renderDangerousContent = false
    terms = new Rendering.Terms()

    clone(): Rendering {
      const clone = new Rendering()

      clone.idPrefix = this.idPrefix
      clone.renderDangerousContent = this.renderDangerousContent
      clone.terms = this.terms.clone()

      return clone
    }

    applyUserProvidedSettings(settings: UserProvidedSettings.Rendering): void {
      if (!settings) {
        return
      }

      this.idPrefix =
        coalesce(settings.idPrefix, this.idPrefix)

      this.renderDangerousContent =
        coalesce(settings.renderDangerousContent, this.renderDangerousContent)

      this.terms.applyUserProvidedSettings(settings.terms)
    }
  }


  export namespace Rendering {
    export class Terms {
      footnote: Term = 'footnote'
      footnoteReference: Term = 'footnote reference'
      toggleVisibility: Term = 'toggle visibility'
      sectionReferencedByTableOfContents: Term = 'topic'
      tableOfContents: Term = 'Table of Contents'

      clone(): Terms {
        const clone = new Terms()

        clone.footnote = this.footnote
        clone.footnoteReference = this.footnoteReference
        clone.toggleVisibility = this.toggleVisibility
        clone.sectionReferencedByTableOfContents = this.sectionReferencedByTableOfContents
        clone.tableOfContents = this.tableOfContents

        return clone
      }

      applyUserProvidedSettings(terms: UserProvidedSettings.Rendering.Terms): void {
        if (!terms) {
          return
        }

        this.footnote =
          coalesce(terms.footnote, this.footnote)

        this.footnoteReference =
          coalesce(terms.footnoteReference, this.footnoteReference)

        this.toggleVisibility =
          coalesce(terms.toggleVisibility, this.toggleVisibility)

        this.sectionReferencedByTableOfContents =
          coalesce(terms.sectionReferencedByTableOfContents, this.sectionReferencedByTableOfContents)

        this.tableOfContents =
          coalesce(terms.tableOfContents, this.tableOfContents)
      }
    }

    export type Term = string
  }
}


// We allow multiple variations for each keyword. Internally, each keyword is represented by
// an array of strings containing those variations.
//
// For a given keyword, if the user wants to specify multiple new variations, those variations
// are naturally specified using a string array. However, if the user only wants to specify a
// single new variation, they can specify the single new variation with a plain string.
//
// This function takes the keyword variations provided by the user, cleans them up, and massages
// them into arrays.
function sanitizeVariations(variations: UserProvidedSettings.Parsing.Keyword): Settings.Parsing.Keyword {
  if (variations == null) {
    return []
  }

  const normalizedVariations =
    // First of all, if the user provided a string, let's convert it to an array.
    ((typeof variations === "string") ? [variations] : variations)
      // Let's ignore any term variations that are null or empty.
      .filter(variation => !!variation)
      // Let's trim the remaining term variations...
      .map(variation => variation.trim())
      // ... and then ignore any term variations that were just whitespace!
      .filter(variation => !!variation)

  return distinct(...normalizedVariations)
}
