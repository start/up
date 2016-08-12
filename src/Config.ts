import { UserProvidedSettings} from './UserProvidedSettings'
import { UserProvidedTerms} from './UserProvidedTerms'
import { coalesce } from './CollectionHelpers'


const DEFAULT_SETTINGS: UserProvidedSettings = {
  createTableOfContents: false,
  createSourceMap: false,
  writeUnsafeContent: false,
  documentName: 'up',
  defaultUrlScheme: 'https://',
  baseForUrlsStartingWithSlash: '',
  baseForUrlsStartingWithHashMark: '',

  terms: {
    audio: 'audio',
    chart: 'chart',
    footnote: 'footnote',
    footnoteReference: 'footnote reference',
    highlight: 'highlight',
    image: 'image',
    itemReferencedByTableOfContents: 'item',
    nsfl: 'nsfl',
    nsfw: 'nsfw',
    spoiler: 'spoiler',
    table: 'table',
    tableOfContents: 'Table of Contents',
    toggleNsfl: 'toggle NSFL',
    toggleNsfw: 'toggle NSFW',
    toggleSpoiler: 'toggle spoiler',
    video: 'video'
  }
}


export class Config {
  createTableOfContents: boolean
  createSourceMap: boolean
  writeUnsafeContent: boolean
  documentName: string
  defaultUrlScheme: string
  baseForUrlsStartingWithSlash: string
  baseForUrlsStartingWithHashMark: string

  // TODO: Remove
  settings: UserProvidedSettings

  constructor(changes?: UserProvidedSettings, baseSettings = DEFAULT_SETTINGS) {
    for (const settings of [baseSettings, changes]) {
      this.applySettings(settings)
    }

    // TODO: Remove
    this.settings = applyChanges(baseSettings, changes)
  }

  withChanges(changes: UserProvidedSettings): Config {
    return new Config(changes, this.settings)
  }

  localizeTerm(nonLocalizedTerm: string): string {
    const localizedTerm = this.settings.terms[nonLocalizedTerm]

    if (localizedTerm) {
      return localizedTerm
    }

    throw new Error('Unrecognized term: ' + nonLocalizedTerm)
  }

  private applySettings(settings: UserProvidedSettings): void {
    if (!settings) {
      return
    }

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
    video = 'video';

    applySettings(terms: UserProvidedTerms): void {
      this.audio =
        coalesce(terms.audio && this.audio)

      this.chart =
        coalesce(terms.chart && this.chart)

      this.footnote =
        coalesce(terms.footnote && this.footnote)

      this.footnoteReference =
        coalesce(terms.footnoteReference && this.footnoteReference)

      this.highlight =
        coalesce(terms.highlight && this.highlight)

      this.itemReferencedByTableOfContents =
        coalesce(terms.itemReferencedByTableOfContents && this.itemReferencedByTableOfContents)

      this.nsfw =
        coalesce(terms.nsfw && this.nsfw)

      this.spoiler =
        coalesce(terms.spoiler && this.spoiler)

      this.table =
        coalesce(terms.table && this.table)

      this.tableOfContents =
        coalesce(terms.tableOfContents && this.tableOfContents)

      this.toggleNsfl =
        coalesce(terms.toggleNsfl && this.toggleNsfl)

      this.toggleNsfw =
        coalesce(terms.toggleNsfw && this.toggleNsfw)

      this.toggleSpoiler =
        coalesce(terms.toggleSpoiler && this.toggleSpoiler)

      this.video =
        coalesce(terms.video && this.video)
    }
  }
}


// Recursively merges `base` and `changes` and returns the result. Neither argument is mutated.
//
// Any fields on `changes` that do not also exist on `base` are ignored.
function applyChanges(base: StringInxexable, changes: StringInxexable): StringInxexable {
  if (changes == null) {
    return base
  }

  const merged: StringInxexable = {}

  for (const key in base) {
    const baseValue = merged[key] = base[key]
    const changedValue = changes[key]

    if (changedValue != null) {
      // If a changed value is present, we assume it has the same type as the base value.
      merged[key] =
        typeof baseValue === 'object'
          ? applyChanges(baseValue, changedValue)
          : changedValue
    }
  }

  return merged
}


interface StringInxexable {
  [key: string]: any
}
