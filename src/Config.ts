import { UserProvidedSettings} from './UserProvidedSettings'
import { coalesce, distinct } from './CollectionHelpers'


export class Config {
  createSourceMap = false
  renderUnsafeContent = false
  idPrefix = 'up'
  defaultUrlScheme = 'https://'
  baseForUrlsStartingWithSlash = ''
  baseForUrlsStartingWithHashMark = ''

  terms = new Config.Terms()

  constructor(settings?: UserProvidedSettings) {
    if (settings) {
      this.applyUserProvidedSettings(settings)
    }
  }

  // Returns a new `Config` object with the changes applied.
  withChanges(changes: UserProvidedSettings): Config {
    const clone = new Config()

    clone.createSourceMap = this.createSourceMap
    clone.renderUnsafeContent = this.renderUnsafeContent
    clone.idPrefix = this.idPrefix
    clone.defaultUrlScheme = this.defaultUrlScheme
    clone.baseForUrlsStartingWithSlash = this.baseForUrlsStartingWithSlash
    clone.baseForUrlsStartingWithHashMark = this.baseForUrlsStartingWithHashMark

    clone.terms = this.terms.clone()

    if (changes) {
      clone.applyUserProvidedSettings(changes)
    }

    return clone
  }

  private applyUserProvidedSettings(settings: UserProvidedSettings): void {
    this.createSourceMap =
      coalesce(settings.createSourceMap, this.createSourceMap)

    this.renderUnsafeContent =
      coalesce(settings.renderUnsafeContent, this.renderUnsafeContent)

    this.idPrefix =
      coalesce(settings.idPrefix, this.idPrefix)

    this.defaultUrlScheme =
      coalesce(settings.defaultUrlScheme, this.defaultUrlScheme)

    this.baseForUrlsStartingWithSlash =
      coalesce(settings.baseForUrlsStartingWithSlash, this.baseForUrlsStartingWithSlash)

    this.baseForUrlsStartingWithHashMark =
      coalesce(settings.baseForUrlsStartingWithHashMark, this.baseForUrlsStartingWithHashMark)

    this.terms.applyUserProvidedSettings(settings.terms)
  }
}


export namespace Config {
  export class Terms {
    markup = new Terms.Markup()
    rendered = new Terms.Rendered()

    clone(): Terms {
      const clone = new Terms()

      clone.markup = this.markup.clone()
      clone.rendered = this.rendered.clone()

      return clone
    }

    applyUserProvidedSettings(terms: UserProvidedSettings.Terms): void {
      if (!terms) {
        return
      }

      this.markup.applyUserProvidedSettings(terms.markup)
      this.rendered.applyUserProvidedSettings(terms.output)
    }
  }

  export namespace Terms {
    // Config.Terms.FoundInMarkup
    export type FoundInMarkup = string[]

    // Config.Terms.Markup
    export class Markup {
      // Users can provide new variations for markup terms, but they can't overwrite the
      // defaults.
      //
      // However, users *can* overwrite their own terms! If the user creates an `Up` object
      // and provides custom markup terms to its constructor, those terms can be overwritten
      // by providing the `toDocument` method with a different set of terms.
      //
      // The private fields below represent the (sanitized) variations provided by the user
      // for each term.
      private _audio: Terms.FoundInMarkup = []
      private _chart: Terms.FoundInMarkup = []
      private _highlight: Terms.FoundInMarkup = []
      private _image: Terms.FoundInMarkup = []
      private _nsfl: Terms.FoundInMarkup = []
      private _nsfw: Terms.FoundInMarkup = []
      private _referenceToTableOfContentsEntry: Terms.FoundInMarkup = []
      private _spoiler: Terms.FoundInMarkup = []
      private _table: Terms.FoundInMarkup = []
      private _video: Terms.FoundInMarkup = []

      get audio(): Terms.FoundInMarkup {
        return distinct('audio', ...this._audio)
      }

      get chart(): Terms.FoundInMarkup {
        return distinct('chart', ...this._chart)
      }

      get highlight(): Terms.FoundInMarkup {
        return distinct('highlight', 'mark', ...this._highlight)
      }

      get image(): Terms.FoundInMarkup {
        return distinct('image', 'img', ...this._image)
      }

      get nsfl(): Terms.FoundInMarkup {
        return distinct('nsfl', ...this._nsfl)
      }

      get nsfw(): Terms.FoundInMarkup {
        return distinct('nsfw', ...this._nsfw)
      }

      get referenceToTableOfContentsEntry(): Terms.FoundInMarkup {
        return distinct('section', 'topic', ...this._referenceToTableOfContentsEntry)
      }

      get spoiler(): Terms.FoundInMarkup {
        return distinct('spoiler', ...this._spoiler)
      }

      get table(): Terms.FoundInMarkup {
        return distinct('table', ...this._table)
      }

      get video(): Terms.FoundInMarkup {
        return distinct('video', 'vid', ...this._video)
      }

      clone(): Markup {
        const clone = new Markup()

        clone._audio = this._audio
        clone._chart = this._chart
        clone._highlight = this._highlight
        clone._image = this._image
        clone._nsfl = this._nsfl
        clone._referenceToTableOfContentsEntry = this._referenceToTableOfContentsEntry
        clone._nsfw = this._nsfw
        clone._spoiler = this._spoiler
        clone._table = this._table
        clone._video = this._video

        return clone
      }

      applyUserProvidedSettings(terms: UserProvidedSettings.Terms.Markup): void {
        if (!terms) {
          return
        }

        this._audio =
          sanitizeVariations(terms.audio)

        this._chart =
          sanitizeVariations(terms.chart)

        this._highlight =
          sanitizeVariations(terms.highlight)

        this._image =
          sanitizeVariations(terms.image)

        this._nsfl =
          sanitizeVariations(terms.nsfl)

        this._nsfw =
          sanitizeVariations(terms.nsfw)

        this._referenceToTableOfContentsEntry =
          sanitizeVariations(terms.referenceToTableOfContentsEntry)

        this._spoiler =
          sanitizeVariations(terms.spoiler)

        this._table =
          sanitizeVariations(terms.table)

        this._video =
          sanitizeVariations(terms.video)
      }
    }


    // Terms.RenderedToOutput
    export type RenderedToOutput = string

    // Config.Terms.RenderedToOutput
    export class Rendered {
      footnote: Terms.RenderedToOutput = 'footnote'
      footnoteReference: Terms.RenderedToOutput = 'footnote reference'
      itemReferencedByTableOfContents: Terms.RenderedToOutput = 'item'
      tableOfContents: Terms.RenderedToOutput = 'Table of Contents'
      toggleNsfl: Terms.RenderedToOutput = 'toggle NSFL'
      toggleNsfw: Terms.RenderedToOutput = 'toggle NSFW'
      toggleSpoiler: Terms.RenderedToOutput = 'toggle spoiler'

      clone(): Rendered {
        const clone = new Rendered()

        clone.footnote = this.footnote
        clone.footnoteReference = this.footnoteReference
        clone.itemReferencedByTableOfContents = this.itemReferencedByTableOfContents
        clone.tableOfContents = this.tableOfContents
        clone.toggleNsfl = this.toggleNsfl
        clone.toggleNsfw = this.toggleNsfw
        clone.toggleSpoiler = this.toggleSpoiler

        return clone
      }

      applyUserProvidedSettings(terms: UserProvidedSettings.Terms.Rendered): void {
        if (!terms) {
          return
        }

        this.footnote =
          coalesce(terms.footnote, this.footnote)

        this.footnoteReference =
          coalesce(terms.footnoteReference, this.footnoteReference)

        this.itemReferencedByTableOfContents =
          coalesce(terms.itemReferencedByTableOfContents, this.itemReferencedByTableOfContents)

        this.tableOfContents =
          coalesce(terms.tableOfContents, this.tableOfContents)

        this.toggleNsfl =
          coalesce(terms.toggleNsfl, this.toggleNsfl)

        this.toggleNsfw =
          coalesce(terms.toggleNsfw, this.toggleNsfw)

        this.toggleSpoiler =
          coalesce(terms.toggleSpoiler, this.toggleSpoiler)
      }
    }
  }
}


// In Up, there are two types of terms:
//
// 1. Terms found in markup (e.g. "image", "table")
// 2. Terms rendered to output (e.g. "Table of Contents", "toggle NSFW")
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
function sanitizeVariations(variations: UserProvidedSettings.Terms.FoundInMarkup): Config.Terms.FoundInMarkup {
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
