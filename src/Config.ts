import { UserProvidedSettings} from './UserProvidedSettings'
import { UserProvidedTerms} from './UserProvidedTerms'
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
  export type AppearsInMarkup = string[]
  export type AppearsInOutput = string

  export class Terms {
    audio: AppearsInMarkup = ['audio']
    chart: AppearsInMarkup = ['chart']
    highlight: AppearsInMarkup = ['highlight']
    image: AppearsInMarkup = ['image']
    nsfl: AppearsInMarkup = ['nsfl']
    nsfw: AppearsInMarkup = ['nsfw']
    spoiler: AppearsInMarkup = ['spoiler']
    table: AppearsInMarkup = ['table']
    video: AppearsInMarkup = ['video']
    
    footnote: AppearsInOutput = 'footnote'
    footnoteReference: AppearsInOutput = 'footnote reference'
    itemReferencedByTableOfContents: AppearsInOutput = 'item'
    tableOfContents: AppearsInOutput = 'Table of Contents'
    toggleNsfl: AppearsInOutput = 'toggle NSFL'
    toggleNsfw: AppearsInOutput = 'toggle NSFW'
    toggleSpoiler: AppearsInOutput = 'toggle spoiler'

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

    applyChangedUserSettings(terms: UserProvidedTerms): void {
      if (!terms) {
        return
      }

      this.audio =
        coalesce(terms.audio, this.audio)

      this.chart =
        coalesce(terms.chart, this.chart)

      this.highlight =
        coalesce(terms.highlight, this.highlight)

      this.image =
        coalesce(terms.image, this.image)

      this.nsfl =
        coalesce(terms.nsfl, this.nsfl)

      this.nsfw =
        coalesce(terms.nsfw, this.nsfw)

      this.spoiler =
        coalesce(terms.spoiler, this.spoiler)

      this.table =
        coalesce(terms.table, this.table)

      this.video =
        coalesce(terms.video, this.video)

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
