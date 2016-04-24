export interface WriterConfigArgs {
  documentName?: string,

  i18n?: {
    idWordDelimiter?: string,

    terms?: {
      footnote?: string,
      footnoteReference?: string
    },
  }
}

export class WriterConfig {
  private config: WriterConfigArgs

  constructor(args: WriterConfigArgs) {
    args = args || {}
    const i18n = args.i18n || {}
    const i18nTerms = i18n.terms || {}

    this.config = {
      documentName: args.documentName || '',

      i18n: {
        idWordDelimiter: i18n.idWordDelimiter || '-',

        terms: {
          footnote: i18nTerms.footnote || 'footnote',
          footnoteReference: i18nTerms.footnoteReference || 'footnote reference',
        }
      }
    }
  }

  private getId(...parts: string[]): string {
    const allParts = [this.config.documentName].concat(parts)
    const rawId = allParts.join(' ')

    return (
      rawId
        .trim()
        .replace(/\s+/g, this.config.i18n.idWordDelimiter))
  }

  footnoteId(referenceNumber: number): string {
    return this.getId(this.config.i18n.terms.footnote, referenceNumber.toString())
  }

  footnoteReferenceId(referenceNumber: number): string {
    return this.getId(this.config.i18n.terms.footnoteReference, referenceNumber.toString())
  }
}
