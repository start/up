interface I18nArgs {
  idDelimiter?: string,
  terms: I18nTerms,
}

interface I18nTerms {
  footnote: string
}

interface WriterConfigArgs {
  documentId?: string,
  i18n?: I18nArgs
}

export class WriterConfig {
  private config: WriterConfigArgs

  constructor(args: WriterConfigArgs) {
    this.config = {
      documentId: args.documentId || '',
      
      i18n: {
        idDelimiter: args.i18n.idDelimiter || '-',
        
        terms: {
          footnote: args.i18n.terms.footnote || 'footnote',
        }
      }
    }
  }

  private id(...parts: string[]): string {
    return (
      [this.config.documentId]
        .concat(parts)
        .filter(part => !!part)
        .join(this.config.i18n.idDelimiter)
    )
  }

  private footnoteId(ordinal: number): string {
    return this.id(this.config.i18n.terms.footnote, ordinal.toString())
  }
}