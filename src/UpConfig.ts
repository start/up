import { UpConfigArgs} from './UpConfigArgs'

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

  constructor(args?: UpConfigArgs) {
    args = args || {}
    const i18n = args.i18n || {}
    const i18nTerms = i18n.terms || {}

    this.settings = {
      documentName: args.documentName || '',

      i18n: {
        idWordDelimiter: i18n.idWordDelimiter || '-',

        terms: {
          image: i18nTerms.image || 'image',
          audio: i18nTerms.audio || 'audio',
          video: i18nTerms.video || 'video',
          spoiler: i18nTerms.spoiler || 'spoiler',
          footnote: i18nTerms.footnote || 'footnote',
          footnoteReference: i18nTerms.footnoteReference || 'footnote reference',
        }
      }
    }
  }

  localize(nonLocalizedTerm: string): string {
    const localizedTerm = this.settings.i18n.terms[nonLocalizedTerm]

    if (localizedTerm) {
      return localizedTerm
    }

    throw new Error(`Unrecognizes term: ${nonLocalizedTerm}`)
  }
}