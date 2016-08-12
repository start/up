import { ConfigSettings} from './ConfigSettings'
import { coalesce } from './CollectionHelpers'

const DEFAULT_SETTINGS: ConfigSettings = {
  createTableOfContents: false,
  createSourceMap: false,

  writeUnsafeContent: false,

  documentName: 'up',

  defaultUrlScheme: 'https://',
  baseForUrlsStartingWithSlash: '',
  baseForUrlsStartingWithHashMark: '',

  i18n: {
    wordDelimiterForGeneratedIds: '-',

    terms: {
      tableOfContents: 'Table of Contents',
      itemReferencedByTableOfContents: 'item',
      table: 'table',
      chart: 'chart',
      image: 'image',
      audio: 'audio',
      video: 'video',
      highlight: 'highlight',
      spoiler: 'spoiler',
      toggleSpoiler: 'toggle spoiler',
      nsfw: 'nsfw',
      toggleNsfw: 'toggle NSFW',
      nsfl: 'nsfl',
      toggleNsfl: 'toggle NSFL',
      footnote: 'footnote',
      footnoteReference: 'footnote reference'
    }
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

  wordDelimiterForGeneratedIds: string

  // TODO: Remove
  settings: ConfigSettings

  constructor(changes?: ConfigSettings, baseSettings = DEFAULT_SETTINGS) {
    for (const settings of [baseSettings, changes]) {
      this.applySettings(settings)
    }

    // TODO: Remove
    this.settings = applyChanges(baseSettings, changes)
  }

  withChanges(changes: ConfigSettings): Config {
    return new Config(changes, this.settings)
  }

  localizeTerm(nonLocalizedTerm: string): string {
    const localizedTerm = this.settings.i18n.terms[nonLocalizedTerm]

    if (localizedTerm) {
      return localizedTerm
    }

    throw new Error('Unrecognized term: ' + nonLocalizedTerm)
  }

  private applySettings(settings: ConfigSettings): void {
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

    if (!settings.i18n) {
      return
    }

    this.wordDelimiterForGeneratedIds =
      coalesce(settings.i18n.wordDelimiterForGeneratedIds, this.wordDelimiterForGeneratedIds)
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
