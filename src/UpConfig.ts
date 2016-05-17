import { UpConfigArgs} from './UpConfigArgs'
import { merge } from './ObjectHelpers'


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
