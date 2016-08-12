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

    if (changes) {
      clone.applyChangedUserSettings(changes)
      clone.terms = this.terms.withChanges(changes.terms)
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
    audio = 'audio'
    chart = 'chart'
    footnote = 'footnote'
    footnoteReference = 'footnote reference'
    highlight = 'highlight'
    image = 'image'
    itemReferencedByTableOfContents = 'item'
    nsfl = 'nsfl'
    nsfw = 'nsfw'
    spoiler = 'spoiler'
    table = 'table'
    tableOfContents = 'Table of Contents'
    toggleNsfl = 'toggle NSFL'
    toggleNsfw = 'toggle NSFW'
    toggleSpoiler = 'toggle spoiler'
    video = 'video'

    // Returns a new `Terms` object with the changes applied.
    withChanges(terms: UserProvidedTerms): Terms {
      const clone = new Terms()

      clone.audio = this.audio
      clone.chart = this.chart
      clone.footnote = this.footnote
      clone.footnoteReference = this.footnoteReference
      clone.highlight = this.highlight
      clone.image = this.image
      clone.itemReferencedByTableOfContents = this.itemReferencedByTableOfContents
      clone.nsfl = this.nsfl
      clone.nsfw = this.nsfw
      clone.spoiler = this.spoiler
      clone.table = this.table
      clone.tableOfContents = this.tableOfContents
      clone.toggleNsfl = this.toggleNsfl
      clone.toggleNsfw = this.toggleNsfw
      clone.toggleSpoiler = this.toggleSpoiler
      clone.video = this.video

      clone.applyChangedUserSettings(terms)

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

      this.footnote =
        coalesce(terms.footnote, this.footnote)

      this.footnoteReference =
        coalesce(terms.footnoteReference, this.footnoteReference)

      this.highlight =
        coalesce(terms.highlight, this.highlight)

      this.image =
        coalesce(terms.image, this.image)

      this.itemReferencedByTableOfContents =
        coalesce(terms.itemReferencedByTableOfContents, this.itemReferencedByTableOfContents)

      this.nsfl =
        coalesce(terms.nsfw, this.nsfl)

      this.nsfw =
        coalesce(terms.nsfw, this.nsfw)

      this.spoiler =
        coalesce(terms.spoiler, this.spoiler)

      this.table =
        coalesce(terms.table, this.table)

      this.tableOfContents =
        coalesce(terms.tableOfContents, this.tableOfContents)

      this.toggleNsfl =
        coalesce(terms.toggleNsfl, this.toggleNsfl)

      this.toggleNsfw =
        coalesce(terms.toggleNsfw, this.toggleNsfw)

      this.toggleSpoiler =
        coalesce(terms.toggleSpoiler, this.toggleSpoiler)

      this.video =
        coalesce(terms.video, this.video)
    }
  }
}
