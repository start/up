import { UpConfigArgs} from './UpConfigArgs'
import { merge } from './ObjectHelpers'


const DEFAULT_CONFIG = {
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

  constructor(configArgs?: UpConfigArgs) {
    this.settings = merge(DEFAULT_CONFIG, configArgs)
  }

  localize(nonLocalizedTerm: string): string {
    const localizedTerm = this.settings.i18n.terms[nonLocalizedTerm]

    if (localizedTerm) {
      return localizedTerm
    }

    throw new Error(`Unrecognizes term: ${nonLocalizedTerm}`)
  }
}