import { UpConfigSettings} from './UpConfigSettings'


const DEFAULT_SETTINGS: UpConfigSettings = {
  createTableOfContents: false,
  
  documentName: 'up',

  defaultUrlScheme: 'https://',
  baseForUrlsStartingWithSlash: '',
  baseForUrlsStartingWithHashMark: '',

  i18n: {
    idWordDelimiter: '-',

    terms: {
      table: 'table',
      chart: 'chart',
      image: 'image',
      audio: 'audio',
      video: 'video',
      spoiler: 'spoiler',
      toggleSpoiler: 'toggle spoiler',
      nsfw: 'nsfw',
      toggleNsfw: 'toggle NSFW',
      nsfl: 'nsfl',
      toggleNsfl: 'toggle NSFL',
      footnote: 'footnote',
      footnoteReference: 'footnote reference',
      tableOfContents: 'Table of Contents',
      itemReferencedByTableOfContents: 'part'
    }
  }
}


export class UpConfig {
  settings: UpConfigSettings

  constructor(changes?: UpConfigSettings, baseSettings = DEFAULT_SETTINGS) {
    this.settings = applyChanges(baseSettings, changes)
  }

  withChanges(changes: UpConfigSettings): UpConfig {
    return new UpConfig(changes, this.settings)
  }

  localizeTerm(nonLocalizedTerm: string): string {
    const localizedTerm = this.settings.i18n.terms[nonLocalizedTerm]

    if (localizedTerm) {
      return localizedTerm
    }

    throw new Error('Unrecognized term: ' + nonLocalizedTerm)
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
