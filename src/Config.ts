import { UserProvidedSettings} from './UserProvidedSettings'
import { coalesce } from './CollectionHelpers'


export class Config {
  createTableOfContents = false
  createSourceMap = false
  writeUnsafeContent = false
  documentName = 'up'
  defaultUrlScheme = 'https://'
  baseForUrlsStartingWithSlash = ''
  baseForUrlsStartingWithHashMark = ''

  terms = new Config.Terms()

  constructor(settings?: UserProvidedSettings) {
    if (settings) {
      this.applyChangedUserSettings(settings)
    }
  }

  // Returns a new `Config` object with the changes applied.
  withChanges(changes: UserProvidedSettings): Config {
    const clone = new Config()

    clone.createTableOfContents = this.createTableOfContents
    clone.createSourceMap = this.createSourceMap
    clone.writeUnsafeContent = this.writeUnsafeContent
    clone.documentName = this.documentName
    clone.defaultUrlScheme = this.defaultUrlScheme
    clone.baseForUrlsStartingWithSlash = this.baseForUrlsStartingWithSlash
    clone.baseForUrlsStartingWithHashMark = this.baseForUrlsStartingWithHashMark

    clone.terms = this.terms.clone()

    if (changes) {
      clone.applyChangedUserSettings(changes)
    }

    return clone
  }

  private applyChangedUserSettings(settings: UserProvidedSettings): void {
    this.createTableOfContents =
      coalesce(settings.createTableOfContents, this.createTableOfContents)

    this.createSourceMap =
      coalesce(settings.createSourceMap, this.createSourceMap)

    this.writeUnsafeContent =
      coalesce(settings.writeUnsafeContent, this.writeUnsafeContent)

    this.documentName =
      coalesce(settings.documentName, this.documentName)

    this.defaultUrlScheme =
      coalesce(settings.defaultUrlScheme, this.defaultUrlScheme)

    this.baseForUrlsStartingWithSlash =
      coalesce(settings.baseForUrlsStartingWithSlash, this.baseForUrlsStartingWithSlash)

    this.baseForUrlsStartingWithHashMark =
      coalesce(settings.baseForUrlsStartingWithHashMark, this.baseForUrlsStartingWithHashMark)

    this.terms.applyChangedUserSettings(settings.terms)
  }
}


export namespace Config {
  export class Terms {
    audio: Terms.FoundInMarkup = ['audio']
    chart: Terms.FoundInMarkup = ['chart']
    highlight: Terms.FoundInMarkup = ['highlight']
    image: Terms.FoundInMarkup = ['image']
    nsfl: Terms.FoundInMarkup = ['nsfl']
    nsfw: Terms.FoundInMarkup = ['nsfw']
    spoiler: Terms.FoundInMarkup = ['spoiler']
    table: Terms.FoundInMarkup = ['table']
    video: Terms.FoundInMarkup = ['video']

    footnote: Terms.FoundInOutput = 'footnote'
    footnoteReference: Terms.FoundInOutput = 'footnote reference'
    itemReferencedByTableOfContents: Terms.FoundInOutput = 'item'
    tableOfContents: Terms.FoundInOutput = 'Table of Contents'
    toggleNsfl: Terms.FoundInOutput = 'toggle NSFL'
    toggleNsfw: Terms.FoundInOutput = 'toggle NSFW'
    toggleSpoiler: Terms.FoundInOutput = 'toggle spoiler'

    clone(): Terms {
      const clone = new Terms()

      clone.audio = this.audio
      clone.chart = this.chart
      clone.highlight = this.highlight
      clone.image = this.image
      clone.nsfl = this.nsfl
      clone.nsfw = this.nsfw
      clone.spoiler = this.spoiler
      clone.table = this.table
      clone.video = this.video

      clone.footnote = this.footnote
      clone.footnoteReference = this.footnoteReference
      clone.itemReferencedByTableOfContents = this.itemReferencedByTableOfContents
      clone.tableOfContents = this.tableOfContents
      clone.toggleNsfl = this.toggleNsfl
      clone.toggleNsfw = this.toggleNsfw
      clone.toggleSpoiler = this.toggleSpoiler

      return clone
    }

    applyChangedUserSettings(terms: UserProvidedSettings.Terms): void {
      if (!terms) {
        return
      }

      this.audio =
        changeTermFoundInMarkup(terms.audio, this.audio)

      this.chart =
        changeTermFoundInMarkup(terms.chart, this.chart)

      this.highlight =
        changeTermFoundInMarkup(terms.highlight, this.highlight)

      this.image =
        changeTermFoundInMarkup(terms.image, this.image)

      this.nsfl =
        changeTermFoundInMarkup(terms.nsfl, this.nsfl)

      this.nsfw =
        changeTermFoundInMarkup(terms.nsfw, this.nsfw)

      this.spoiler =
        changeTermFoundInMarkup(terms.spoiler, this.spoiler)

      this.table =
        changeTermFoundInMarkup(terms.table, this.table)

      this.video =
        changeTermFoundInMarkup(terms.video, this.video)

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

  export namespace Terms {
    export type FoundInMarkup = string[]
    export type FoundInOutput = string
  }
}


// In Up, there are two types of terms:
//
// 1. Terms found in markup (e.g. "image", "table")
// 2. Terms found in the output (e.g. "Table of Contents", "toggle NSFW")
//
// We allow multiple variations for terms found in markup. Internally, each markup term is
// represented by an array of strings containing those variations.
//
// For custom markup terms, if the user wants multiple variations, those variations are
// naturally specified using a string array, too. However, if the user doesn't want multiple
// varaitions, they can specify the term with a plain string.
//
// This function converts takes the user's changes to a given markup term (if any) and
// converts those changes to the format we use internally (an array of strings).
function changeTermFoundInMarkup(
  newVariations: UserProvidedSettings.Terms.FoundInMarkup,
  originalVariations: Config.Terms.FoundInMarkup
): Config.Terms.FoundInMarkup {
  if (newVariations == null) {
    return originalVariations
  }

  const normalizedNewVariations =
    // First of all, if the user provided a string, let's convert it to an array.
    ((typeof newVariations === "string") ? [newVariations] : newVariations)
      // Let's ignore any term variations that are null or empty.
      .filter(variation => !!variation)
      // Let's trim the remaining term variations...
      .map(variation => variation.trim())
      // ... and then ignore any term variations that were just whitespace!
      .filter(variation => !!variation)

  return normalizedNewVariations.length ? normalizedNewVariations : originalVariations
}
