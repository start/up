interface I18nArgs {
  idDelimiter?: string,
  terms?: I18nTerms,
}

interface I18nTerms {
  footnote?: string,
  footnoteReference?: string
}

export interface WriterConfigArgs {
  documentId?: string,
  i18n?: I18nArgs
}

export class WriterConfig {
  private config: WriterConfigArgs

  constructor(args: WriterConfigArgs) {
    args = args || { }
    const i18n: I18nArgs = args.i18n || { }
    const terms: I18nTerms = i18n.terms || { }
    
    this.config = {
      documentId: args.documentId || '',
      
      i18n: {
        idDelimiter: i18n.idDelimiter || '-',
        
        terms: {
          footnote: terms.footnote || 'footnote',
          footnoteReference: terms.footnoteReference || 'footnote-reference',
        }
      }
    }
  }

  private getId(...parts: string[]): string {
    return (
      [this.config.documentId]
        .concat(parts)
        .filter(part => !!part)
        .join(this.config.i18n.idDelimiter)
    )
  }

  getFootnoteId(ordinal: number): string {
    return this.getId(this.config.i18n.terms.footnote, ordinal.toString())
  }
}