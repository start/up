import { UpConfigArgs} from './UpConfigArgs'


const DEFAULT_CONFIG: UpConfigArgs = {
  documentName: <string>null,
  
  i18n: {
    idWordDelimiter: '-',

    terms: {
      image: 'image',
      audio: 'audio',
      video: 'video',
      spoiler: 'spoiler',
      footnote: 'footnote',
      footnoteReference: 'footnote reference'
    }
  }
}


export class UpConfig {
  public settings: UpConfigArgs

  constructor(configArgs?: UpConfigArgs, defaults = DEFAULT_CONFIG) {
    this.settings = merge(defaults, configArgs)
  }
  
  withChanges(changes: UpConfigArgs): UpConfig {
    return new UpConfig(changes, this.settings)
  }

  localizeTerm(nonLocalizedTerm: string): string {
    const localizedTerm = this.settings.i18n.terms[nonLocalizedTerm]

    if (localizedTerm) {
      return localizedTerm
    }

    throw new Error(`Unrecognizes term: ${nonLocalizedTerm}`)
  }
}


function merge(base: StringInxexable, changes: StringInxexable): StringInxexable {
  if (changes == null) {
    return base
  }

  const merged: StringInxexable = {}

  for (const key in base) {
    const baseValue = merged[key] = base[key]
    const changedValue = changes[key]

    if (baseValue == null) {
      merged[key] = changedValue
      continue
    }

    if (changedValue != null) {
      // If a changed value is present, we assume it has the same type as the base value.
      merged[key] =
        typeof baseValue === 'object'
          ? merge(baseValue, changedValue)
          : changedValue
    }
  }

  return merged
}


interface StringInxexable {
  [key: string]: any
}
