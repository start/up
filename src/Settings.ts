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
    terms = new Parsing.Terms()

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
      clone.terms = this.terms.clone()

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

      this.terms.applyUserProvidedSettings(settings.terms)
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
    export class Terms {
      // Users can provide custom variations for markup terms, but they can't overwrite the
      // defaults.
      //
      // However, users *can* overwrite their own custom terms! If the user creates an `Up`
      // object and provides custom markup terms to its constructor, those terms can be
      // overwritten by providing the `parse` method with a different set of terms.
      //
      // The private fields below represent the (sanitized) variations provided by the user
      // for each term.
      private _audio: Term = []
      private _highlight: Term = []
      private _image: Term = []
      private _sectionLink: Term = []
      private _revealable: Term = []
      private _table: Term = []
      private _video: Term = []

      get audio(): Term {
        return distinct('audio', ...this._audio)
      }

      get highlight(): Term {
        return distinct('highlight', ...this._highlight)
      }

      get image(): Term {
        return distinct('image', 'img', ...this._image)
      }

      get sectionLink(): Term {
        return distinct('section', 'topic', ...this._sectionLink)
      }

      get revealable(): Term {
        return distinct('spoiler', 'nsfw', 'nsfl', 'revealable', ...this._revealable)
      }

      get table(): Term {
        return distinct('table', ...this._table)
      }

      get video(): Term {
        return distinct('video', 'vid', ...this._video)
      }

      clone(): Terms {
        const clone = new Terms()

        clone._audio = this._audio
        clone._highlight = this._highlight
        clone._image = this._image
        clone._sectionLink = this._sectionLink
        clone._revealable = this._revealable
        clone._table = this._table
        clone._video = this._video

        return clone
      }

      applyUserProvidedSettings(terms: UserProvidedSettings.Parsing.Terms): void {
        if (!terms) {
          return
        }

        this._audio =
          sanitizeVariations(terms.audio)

        this._highlight =
          sanitizeVariations(terms.highlight)

        this._image =
          sanitizeVariations(terms.image)

        this._sectionLink =
          sanitizeVariations(terms.sectionLink)

        this._revealable =
          sanitizeVariations(terms.revealable)

        this._table =
          sanitizeVariations(terms.table)

        this._video =
          sanitizeVariations(terms.video)
      }
    }

    export type Term = string[]
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
      sectionReferencedByTableOfContents: Term = 'topic'
      tableOfContents: Term = 'Table of Contents'
      revealContent: Term = 'reveal'

      clone(): Terms {
        const clone = new Terms()

        clone.footnote = this.footnote
        clone.footnoteReference = this.footnoteReference
        clone.sectionReferencedByTableOfContents = this.sectionReferencedByTableOfContents
        clone.tableOfContents = this.tableOfContents
        clone.revealContent = this.revealContent

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

        this.sectionReferencedByTableOfContents =
          coalesce(terms.sectionReferencedByTableOfContents, this.sectionReferencedByTableOfContents)

        this.tableOfContents =
          coalesce(terms.tableOfContents, this.tableOfContents)

        this.revealContent =
          coalesce(terms.revealContent, this.revealContent)
      }
    }

    export type Term = string
  }
}


// In Up, there are two types of terms:
//
// 1. Terms found in markup (e.g. "image", "table")
// 2. Terms rendered to output (e.g. "Table of Contents", "reveal")
//
// We allow multiple variations for terms found in markup. Internally, each markup term is
// represented by an array of strings containing those variations.
//
// For custom markup terms, if the user wants to specify multiple new variations, those
// variations are naturally specified using a string array. However, if the user only wants
// to specify a single new variation, they can specify the single new variation with a plain
// string.
//
// This function takes the markup terms provided by the user, cleans them up, and massages
// them into the format we use internally.
function sanitizeVariations(variations: UserProvidedSettings.Parsing.Term): Settings.Parsing.Term {
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
